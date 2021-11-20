using System.Threading.Tasks;

namespace Supercell.Web.Controllers
{
    using Microsoft.AspNetCore.SignalR;

    namespace SignalRChat.Hubs
    {
        public class ColorSchema
        {
            public string BackgroundColor { get; set; }
            public string Color { get; set; }
        }
        public class ChatHub : Hub
        {
            public async Task SendMessage(string user, ColorSchema color, string message)
            {
                await Clients.All.SendAsync("ReceiveMessage", user, color, message);

                ChatController._history.Add(new ChatMessage { User = user, Color = color, Message = message });
            }
        }
    }
}
