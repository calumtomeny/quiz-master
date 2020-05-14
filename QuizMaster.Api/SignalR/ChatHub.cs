using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace QuizMaster.Api.SignalR
{
    public class ChatHub : Hub
    {
        public async Task SendMessage(string message)
        {
            await Clients.All.SendAsync("SendMessage", message);
        }
    }
}