using Microsoft.AspNetCore.Mvc;
using Supercell.Web.Controllers.SignalRChat.Hubs;
using System.Collections.Generic;

namespace Supercell.Web.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ChatController: ControllerBase
    {
        public static List<ChatMessage> History = new List<ChatMessage>();

        [HttpGet("GetHistory")]
        public IEnumerable<ChatMessage> GetHistory()
        {
            return History;
        }

        [HttpGet("GetCurrentUsers")]
        public int CurrentUsers()
        {
            return ChatHub.ConnectedIds.Count;
        }
    }

    public class ChatMessage
    {
        public string Message { get; set; }
        public string User { get; set; }
        public ColorSchema Color { get; set; }
    }

}
