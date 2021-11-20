using System.Threading.Tasks;

namespace Supercell.Web.Controllers
{
    using Microsoft.AspNetCore.SignalR;
    using System;
    using System.Collections.Generic;

    namespace SignalRChat.Hubs
    {
        public class ChatHub : Hub
        {
            public static HashSet<string> ConnectedIds = new HashSet<string>();

            public async Task ForceSendMessage(string user, ColorSchema color, string message)
            {
                await Clients.All.SendAsync("ReceiveMessage", user, color, message);

                ChatController.History.Add(new ChatMessage { User = user, Color = color, Message = message });
            }

            public async Task SendMessage(string user, ColorSchema color, string message)
            {
                if (!IsMessagePC(message))
                {
                    await Clients.All.SendAsync("ReceiveMessage", user, color, message);

                    ChatController.History.Add(new ChatMessage { User = user, Color = color, Message = message });
                }
                else
                {
                    await Clients.Caller.SendAsync("ReceiveCorrection", CorrectMessage(message), message);
                }
            }

            private string CorrectMessage(string message) => message.Replace("fuck", "love", StringComparison.InvariantCultureIgnoreCase);

            private bool IsMessagePC(string message)
            {
                return message.Contains("fuck", StringComparison.InvariantCultureIgnoreCase);
            }

            public override async Task OnConnectedAsync()
            {
                ConnectedIds.Add(Context.ConnectionId);

                await Clients.All.SendAsync("UserConencted", ConnectedIds.Count);

                await base.OnConnectedAsync();
            }

            public override async Task OnDisconnectedAsync(Exception exception)
            {
                ConnectedIds.Remove(Context.ConnectionId);

                await Clients.All.SendAsync("UserDisconnected", ConnectedIds.Count);

                await base.OnDisconnectedAsync(exception);
            }
        }
    }
}
