namespace hello_its_me_api.Models
{
    public class PasswordChangeData
    {
        public string Username { get; set; }
        public string OldPassword { get; set; }
        public string NewPassword { get; set; }
    }
}