using hello_its_me_api.Functions;
using hello_its_me_api.Models;
using hello_its_me_api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using System.IdentityModel.Tokens.Jwt;

namespace hello_its_me_api.Controllers
{
    [Route("api/auth/manage-account")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly UserService _users;
        public IConfiguration _configuration;

        public AccountController(UserService users, IConfiguration configuration)
        {
            _users = users;
            _configuration = configuration;
        }
        [HttpPatch]
        [Authorize]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]
        public async Task<ActionResult<ResponseMessage>> Patch(PasswordChangeData data)
        {
            var filter = Builders<User>.Filter.Eq(x => x.Username, data.Username);
            var user = await _users.GetAsyncWithQuery(filter);
            var response = new ResponseMessage();

            if (user == null)
            {
                response = new ResponseMessage()
                {
                    Message = "Wrong username"
                };
                return BadRequest(response);
            }

            if (!PasswordHasher.VerifyPassword(data.OldPassword, user.Password))
            {
                response = new ResponseMessage()
                {
                    Message = "Old password is not valid"
                };
                return BadRequest(response);
            }

            if (data.NewPassword.Length < 8)
            {
                response = new ResponseMessage
                {
                    Message = "Password need to be at least 8 characters long"
                };
                return BadRequest(response);
            }

            await _users.UpdatePasswordAsync(user.Id, PasswordHasher.HashPassword(data.NewPassword));
            response = new ResponseMessage
            {
                Message = "Password changed successfully"
            };

            return Ok(response);
        }

        [HttpDelete]
        [Authorize]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]
        public async Task<ActionResult<ResponseMessage>> Delete()
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

            var response = new ResponseMessage();

            await _users.RemoveAsync(user.Id);
            response = new ResponseMessage 
            {
                Message = "Account deleted"
            };

            return Ok(response);
        }
    }
}


