# Hello it's me
Hello its me was created as an simple social app, and is not meant to be actually hosted and maintained. It is only proof of my skills
### What is this made of
We have both Node.js & ASP.Net Core APIs, here's what they do

ASP.Net CORE API

Widely understood `USER MANAGMENT`:

- Registration/Sign In process
- JWT Token Signing
- Every user data update from app
- Password change
- Account deletion

From user related stuff Node.js API only handles file (avatar/picture) uploads, Node.js API does not perform any `WRITE` action to database

For database MongoDB is used, with only one data model which is `USER`
<details>
  
```c#
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
```
</details>

### Closing statement
Main purpose of this project was to learn how JWT based auth works. That's why I didn't used any of many auth providers. Also project is divided into .NET and Node.js to practise how REST API works in .Net Framework
