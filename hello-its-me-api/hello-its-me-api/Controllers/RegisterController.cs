using hello_its_me_api.Functions;
using hello_its_me_api.Models;
using hello_its_me_api.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using MongoDB.Driver;
using static System.Net.Mime.MediaTypeNames;
using System.Text.RegularExpressions;

namespace hello_its_me_api.Controllers
{
    [Route("api/auth/register")]
    [ApiController]
    public class RegisterController : ControllerBase
    {
        private readonly UserService _users;
        public IConfiguration _configuration;

        public RegisterController(UserService users, IConfiguration configuration)
        {
            _users = users;
            _configuration = configuration;
        }

        [HttpPost]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]
        public async Task<ActionResult<ResponseMessage>> Post(LoginData data)
        {
            var filter = Builders<User>.Filter.Eq(x => x.Username, data.Username);
            var user = await _users.GetAsyncWithQuery(filter);
            var response = new ResponseMessage();

            if (user != null) 
            {
                response = new ResponseMessage
                {
                    Message = "User already exists"
                };
                return BadRequest(response);
            }

            bool containsSpaces = Regex.IsMatch(data.Username, @"\s");
            bool containsSpecialChars = Regex.IsMatch(data.Username, @"[^a-zA-Z0-9\s]");

            // Validation checks
            if (containsSpaces)
            {
                response = new ResponseMessage
                {
                    Message = "Username cannot contain spaces"
                };
                return BadRequest(response);
            }

            if (containsSpecialChars)
            {
                response = new ResponseMessage
                {
                    Message = "Username cannot contain special characters"
                };
                return BadRequest(response);
            }

            if (data.Password.Length < 8)
            {
                response = new ResponseMessage
                {
                    Message = "Password need to be at least 8 characters long"
                };
                return BadRequest(response);
            }

            string[] colorSchemes = ["cyan", "green", "indigo", "pink", "red", "sky", "teal", "yellow"];
            var random = new Random();
            var randomIndex = random.Next(0, colorSchemes.Length);

            var createdUser = new User
            {
                Username = data.Username,
                Password = PasswordHasher.HashPassword(data.Password),
                Nickname = null,
                Status = "No status",
                AvatarUrl = null,
                PictureUrl = null,
                SocialAccounts = [],
                Bio = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod  tempor incididunt ut labore et dolore magna",
                ColorScheme = colorSchemes[randomIndex],
                CreatedAt = DateTime.Now
            };

            await _users.CreateAsync(createdUser);

            var createdUserData = new UserData
            {
                Username = data.Username,
                Nickname = null,
                Status = "No status",
                AvatarUrl = null,
                PictureUrl = null,
                SocialAccounts = [],
                Bio = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod  tempor incididunt ut labore et dolore magna",
                ColorScheme = colorSchemes[randomIndex]
            };

            response = new ResponseMessage
            {
                Message = "Created new user",
                User = createdUserData
            };

            return Ok(response);
        }
    }
}


