using System.Threading.Tasks;

namespace Supercell.Web.Controllers
{
    using Microsoft.AspNetCore.SignalR;
    using Newtonsoft.Json;
    using System;
    using System.Collections.Generic;
    using System.Net.Http;
    using System.Text;

    namespace SignalRChat.Hubs
    {
        public class MessageResponse
        {
            public int Karma { get; set; }

            [JsonProperty("newMessage")]
            public string CorrectedMessage { get; set; }
        }

        public class ChatHub : Hub
        {
            public static string BASE_URL = "http://56e5-85-249-30-61.ngrok.io/";

            static readonly HttpClient client = new HttpClient();

            public static HashSet<string> ConnectedIds = new HashSet<string>();

            public async Task ForceSendMessage(string user, string color, string backgroundColor, string message)
            {
                await Clients.All.SendAsync("ReceiveMessage", user, color, message);
                await SaveMessage(user, color, backgroundColor, message);
            }

            private async Task SaveMessage(string user, string color, string backgroundColor, string message)
            {
                var msg = new ChatMessage { User = user, Color = color, BackgroundColor = backgroundColor, Message = message };

                var sr = JsonConvert.SerializeObject(msg);

                var response = await client.PostAsync($"{BASE_URL}/history", new StringContent(sr, Encoding.UTF8, "application/json"));
                var a = await response.Content.ReadAsStringAsync();

                ChatController.History.Add(msg);
            }

            public async Task SendMessage(string user, string color, string backgroundColor, string message)
            {
                var sr = JsonConvert.SerializeObject(new { username = user, text = message });
                var response = await client.PostAsync($"{BASE_URL}/message", new StringContent(sr, Encoding.UTF8, "application/json"));

                var dr = await response.Content.ReadAsStringAsync();
                var a = JsonConvert.DeserializeObject<MessageResponse>(dr);

                if (a.Karma < 40 && !string.IsNullOrEmpty(a.CorrectedMessage))
                {
                    await Clients.Caller.SendAsync("ReceiveCorrection", a.CorrectedMessage, message, a.Karma);
                }
                else
                {
                    await Clients.All.SendAsync("ReceiveMessage", user, color, message, a.Karma);

                    await SaveMessage(user, color, backgroundColor, message);
                }
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
