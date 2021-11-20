using Supercell.Web.Controllers.SignalRChat.Hubs;

namespace Supercell.Web.Controllers
{
    public class ChatMessage
    {
        public string Message { get; set; }
        public string User { get; set; }
        public ColorSchema Color { get; set; }
    }

    public class ColorSchema
    {
        public string BackgroundColor { get; set; }
        public string Color { get; set; }
    }
}
