namespace hello_its_me_api.Models
{
    public class ResponseMessage
    {
        public string? Message { get; set; }
        public object? User { get; set; }
        public string? AccessToken { get; set; }
    }
}
