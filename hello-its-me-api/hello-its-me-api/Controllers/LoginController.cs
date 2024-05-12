using hello_its_me_api.Functions;
using hello_its_me_api.Models;
using hello_its_me_api.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using MongoDB.Driver;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace hello_its_me_api.Controllers
{
    [Route("api/auth/login")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        private readonly UserService _users;
        public IConfiguration _configuration;

        public LoginController(UserService users, IConfiguration configuration)
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

            if (user == null)
            {
                response = new ResponseMessage()
                {
                    Message = "User does not exist"
                };
                return BadRequest(response);
            }

            if(!PasswordHasher.VerifyPassword(data.Password, user.Password))
            {
                response = new ResponseMessage()
                {
                    Message = "Wrong password"
                };
                return BadRequest(response);
            }

            var claims = new[] {
                new Claim("id", user.Id),
                new Claim("name", user.Nickname == null ? "" : user.Nickname),
                new Claim("user", user.Username)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var signIn = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var token = new JwtSecurityToken(
                _configuration["Jwt:Issuer"],
                _configuration["Jwt:Audience"],
                claims,
                expires: DateTime.UtcNow.AddMinutes(60),
                signingCredentials: signIn);

            response = new ResponseMessage()
            {
                Message = "Login successful",
                AccessToken = new JwtSecurityTokenHandler().WriteToken(token)
            };

            return Ok(response);
        }
    }
}


