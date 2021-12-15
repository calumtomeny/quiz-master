using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using QuizMaster.Api.SignalR;
using QuizMaster.Persistence;
using Microsoft.EntityFrameworkCore;
using MediatR;
using QuizMaster.Api.Filters;
using Microsoft.AspNetCore.Http.Connections;
using QuizMaster.Application.ExampleQuestions;
using List = QuizMaster.Application.Quizzes.List;

namespace QuizMaster.Api
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddDbContext<QuizContext>(opt =>
            {
                opt.UseSqlite(Configuration.GetConnectionString("DefaultConnection"));
            });

            services.AddScoped<ApiKeyAuthAttribute>();
            services.AddScoped<ContestantsApiKeyAuthAttribute>();
            services.AddScoped<AdminApiKeyAuthAttribute>();

            services.AddControllers();
            services.AddSignalR();
            services.AddCors(opt =>
            {
                opt.AddPolicy("CorsPolicy", policy =>
                {
                    policy.AllowAnyHeader().AllowAnyMethod().AllowCredentials().WithOrigins("http://localhost:3000");
                });
            });

            services.AddMediatR(typeof(List.Handler).Assembly);

            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/build";
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, IHostApplicationLifetime lifetime)
        {
            lifetime.ApplicationStarted.Register(OnApplicationStarted);

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            // app.UseHttpsRedirection(); Disable this initially
            app.UseHttpsRedirection();
            app.UseCors("CorsPolicy");

            app.UseRouting();

            // app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapHub<QuizHub>("/quiz", options =>
                {
                    options.Transports = HttpTransportType.LongPolling;
                });
            });

            app.UseStaticFiles();
            app.UseSpaStaticFiles();

            app.UseSpa(spa =>
            {
                spa.Options.SourcePath = "ClientApp/build";
            });
        }

        public void OnApplicationStarted()
        {
            var importer = new CsvImporter();
            importer.Import(Configuration.GetConnectionString("DefaultConnection"));
        }
    }
}
