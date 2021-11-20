using Newtonsoft.Json;
using Supercell.Web.Controllers.SignalRChat.Hubs;

namespace Supercell.Web.Controllers
{
    public class ChatMessage
    {
        [JsonProperty("text")]
        public string Message { get; set; }

        [JsonProperty("username")]
        public string User { get; set; }

        [JsonProperty("background_color")]
        public string BackgroundColor { get; set; }

        [JsonProperty("color")]
        public string Color { get; set; }
    }
}
