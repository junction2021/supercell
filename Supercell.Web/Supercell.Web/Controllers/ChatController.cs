using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Supercell.Web.Controllers.SignalRChat.Hubs;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;

namespace Supercell.Web.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ChatController: ControllerBase
    {
        static readonly HttpClient client = new HttpClient();

        public static List<ChatMessage> History = new List<ChatMessage>();

        [HttpGet("GetHistory")]
        public async Task<IEnumerable<ChatMessage>> GetHistory()
        {
            var history = await client.GetStringAsync($"{ChatHub.BASE_URL}/history");

            return JsonConvert.DeserializeObject<IEnumerable<ChatMessage>>(history);
        }
    }
}
