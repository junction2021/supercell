using Microsoft.AspNetCore.Mvc;

namespace Supercell.Web.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ChatController: ControllerBase
    {
        [HttpPost]
        public ChatMessage Post(ChatMessage chatMessage)
        {
            return chatMessage;
        }
    }
    public class ChatMessage
    {
        public string Message { get; set; }
        public string User { get; set; }
    }

}
