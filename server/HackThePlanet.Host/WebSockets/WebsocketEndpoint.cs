namespace HackThePlanet.Host
{
    using System;
    using System.Collections.Generic;
    using System.Net.WebSockets;
    using System.Text;
    using System.Threading;
    using System.Threading.Tasks;
    using Microsoft.AspNetCore.Http;


    public abstract class WebsocketEndpoint
    {
        protected readonly WebSocketList connections;


        public WebSocketList Connections
        {
            get { return this.connections; }
        }

        #region Constructors
        public WebsocketEndpoint(WebSocketList connections)
        {
            this.connections = connections;
        }
        #endregion


        public abstract Task OnReceiveMessage(
            WebSocket socket,
            WebSocketReceiveResult result,
            byte[] buffer);


        public async Task BroadcastMessageAsync(string message)
        {
            foreach (KeyValuePair<string, WebSocket> entry in this.connections.Sockets)
            {
                if (entry.Value.State == WebSocketState.Open)
                    await SendMessageAsync(entry.Value, message);
            }
        }


        public string ExtractTextMessage(
            WebSocketReceiveResult result,
            byte[] buffer)
        {
            return Encoding.UTF8.GetString(buffer, 0, result.Count);
        }

        public virtual async Task<string> OnHandshake(HttpRequest request, HttpResponse response)
        {
            return Guid.NewGuid().ToString();
        }

        public virtual async Task OnDisconnected(WebSocket socket)
        {
            await this.connections.RemoveSocket(socket);
        }


        public async Task SendMessageAsync(WebSocket socket, string message)
        {
            if (socket.State != WebSocketState.Open)
                return;

            await socket.SendAsync(
                buffer: new ArraySegment<byte>(
                    array: Encoding.UTF8.GetBytes(message),
                    offset: 0,
                    count: message.Length),
                messageType: WebSocketMessageType.Text,
                endOfMessage: true,
                cancellationToken: CancellationToken.None);
        }


        public async Task SendMessageAsync(string socketId, string message)
        {
            await SendMessageAsync(this.connections.GetSocket(socketId), message);
        }
    }
}