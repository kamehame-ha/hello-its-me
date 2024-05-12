using hello_its_me_api.Functions;
using hello_its_me_api.Models;
using hello_its_me_api.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using MongoDB.Driver;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authorization;

namespace hello_its_me_api.Controllers
{
    [Route("api/auth/jwt")]
    [ApiController]
    public class JwtController : ControllerBase
    {
        private readonly UserService _users;
        public IConfiguration _configuration;

        public JwtController(UserService users, IConfiguration configuration)
        {
            _users = users;
            _configuration = configuration;
        }
        [HttpGet]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]
        [Authorize]
        public ActionResult<ResponseMessage> Get()
        {
            string header = Request.Headers["Authorization"];
            var token = header.Split(" ")[1];

            var handler = new JwtSecurityTokenHandler();
            var jwtSecurityToken = handler.ReadJwtToken(token);

            var id = jwtSecurityToken.Claims.FirstOrDefault(claim => claim.Type == "id").Value;
            var nickname = jwtSecurityToken.Claims.FirstOrDefault(claim => claim.Type == "name").Value;
            var username = jwtSecurityToken.Claims.FirstOrDefault(claim => claim.Type == "user").Value;

            var claims = new[] {
                new Claim("id", id),
                new Claim("user", username),
                new Claim("name", nickname)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var signIn = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var newToken = new JwtSecurityToken(
                _configuration["Jwt:Issuer"],
                _configuration["Jwt:Audience"],
                claims,
                expires: DateTime.UtcNow.AddMinutes(10),
                signingCredentials: signIn);

            var user = new
            {
                Username = username,
                Id = id,
                Nickname = nickname,
            };

            var response = new ResponseMessage
            {
                Message = "Token refreshed",
                AccessToken = new JwtSecurityTokenHandler().WriteToken(newToken),
                User = user
            };

            return Ok(response);
        }
    }
}


