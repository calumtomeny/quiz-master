using System;
using System.Text;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.EntityFrameworkCore;
using QuizMaster.Domain;
using QuizMaster.Persistence;

namespace QuizMaster.Application.Admin
{
    public class UpdateGeneralSetting
    {
        public class Command : IRequest<GeneralSetting>
        {
            [Required]
            public string SettingName { get; set; }

            [Required]
            public string SettingValue { get; set; }
        }

        public class Handler : IRequestHandler<Command, GeneralSetting>
        {
            private readonly QuizContext context;

            public Handler(QuizContext context)
            {
                this.context = context;
            }

            public async Task<GeneralSetting> Handle(Command request, CancellationToken cancellationToken)
            {
                var generalSetting = context.GeneralSettings.SingleOrDefault(x => x.Name == request.SettingName);
                if (generalSetting == null)
                {
                    return null;
                }

                var settingValue = request.SettingValue;
                if (request.SettingName == "AdminApiKey")
                {
                    settingValue = Convert.ToBase64String(Encoding.UTF8.GetBytes(settingValue));

                }
                generalSetting.Value = settingValue;

                if (context.ChangeTracker.HasChanges())
                {
                    var success = await context.SaveChangesAsync() > 0;
                    if (success)
                    {
                        return generalSetting;
                    }
                }
                else
                {
                    return generalSetting;
                }

                throw new Exception("There was a problem saving changes.");
            }
        }
    }
}