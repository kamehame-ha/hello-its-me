namespace hello_its_me_api.Models
{
    public class UserData
    {
        public string? Id { get; set; }
        public string? Username { get; set; }
        public string? Nickname { get; set; }

        public string? Status { get; set; }

        public string? AvatarUrl { get; set; }

        public string? PictureUrl { get; set; }

        public List<SocialAccount>? SocialAccounts { get; set; }

        public string? Bio { get; set; }

        public string? ColorScheme { get; set; }
    }
}

