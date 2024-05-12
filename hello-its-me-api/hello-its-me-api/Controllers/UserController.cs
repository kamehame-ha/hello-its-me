using hello_its_me_api.Models;
using hello_its_me_api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using System.IdentityModel.Tokens.Jwt;

namespace hello_its_me_api.Controllers
{
    [Route("api/user/")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly UserService _users;

        public UserController(UserService users)
        {
            _users = users;
        }
        [Authorize]
        [HttpGet]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]
        public async Task<ActionResult<UserData>> Get()
        {
            string header = Request.Headers["Authorization"];
            var token = header.Split(" ")[1];

            var handler = new JwtSecurityTokenHandler();
            var jwtSecurityToken = handler.ReadJwtToken(token);

            var id = jwtSecurityToken.Claims.FirstOrDefault(claim => claim.Type == "id").Value;

            var user = await _users.GetAsync(id);

            if (user is null)
            {
                return BadRequest();
            }

            var userData = new UserData
            {
                Username = user.Username,
                Nickname = user.Nickname,
                Status = user.Status,
                AvatarUrl = user.AvatarUrl,
                PictureUrl = user.PictureUrl,
                SocialAccounts = user.SocialAccounts,
                Bio = user.Bio,
                ColorScheme = user.ColorScheme
            };

            return Ok(userData);
        }
        [HttpGet("{id}", Name = "GetUser")]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]
        public async Task<ActionResult<UserData>> Get(string id)
        {
            var filter = Builders<User>.Filter.Eq(x => x.Username, id);
            var user = await _users.GetAsyncWithQuery(filter) ?? await _users.GetAsync(id);

            if (user is null)
            {
                return BadRequest();
            }

            var userData = new UserData
            {
                Username = user.Username,
                Nickname = user.Nickname,
                Status = user.Status,
                AvatarUrl = user.AvatarUrl,
                PictureUrl = user.PictureUrl,
                SocialAccounts = user.SocialAccounts,
                Bio = user.Bio,
                ColorScheme = user.ColorScheme
            };

            return Ok(userData);
        }
        [Authorize]
        [HttpPut]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        public async Task<IActionResult> Update(UserData user)
        {
            string header = Request.Headers["Authorization"];
            var token = header.Split(" ")[1];

            var handler = new JwtSecurityTokenHandler();
            var jwtSecurityToken = handler.ReadJwtToken(token);

            var id = jwtSecurityToken.Claims.FirstOrDefault(claim => claim.Type == "id").Value;

            var data = await _users.GetAsync(id);

            if (data is null)
            {
                return BadRequest();
            }

            await _users.UpdateAsync(id, user);

            return NoContent();
        }
    }
}

