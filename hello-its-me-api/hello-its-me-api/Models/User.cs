using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace hello_its_me_api.Models
{
    [BsonIgnoreExtraElements]
    public class User
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonElement("username")]
        public string? Username { get; set; }

        [BsonElement("password")]
        public string? Password { get; set; }

        [BsonElement("nickname")]
        public string? Nickname { get; set; }

        [BsonElement("status")]
        public string? Status { get; set; }

        [BsonElement("avatarUrl")]
        public string? AvatarUrl { get; set; }

        [BsonElement("pictureUrl")]
        public string? PictureUrl { get; set; }

        [BsonElement("socialAccounts")]

        public List<SocialAccount>? SocialAccounts { get; set; }

        [BsonElement("bio")]
        public string? Bio { get; set; }

        [BsonElement("colorScheme")]
        public string? ColorScheme { get; set; }

        [BsonElement("created")]
        public DateTime? CreatedAt { get; set; }
    }
}
