using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace QuizMaster.Api.SignalR
{
    public class QuizHub : Hub
    {
        public async Task SendMessage(string message)
        {
            await Clients.All.SendAsync("SendMessage", message);
        }

        public async Task AddToGroup(string groupName)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
        }
    }
}