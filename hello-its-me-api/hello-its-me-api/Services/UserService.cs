using Microsoft.Extensions.Options;
using MongoDB.Driver;
using hello_its_me_api.Models;

namespace hello_its_me_api.Services
{
    public class UserService
    {
        private readonly IMongoCollection<User> _users;

        public UserService(IOptions<DatabaseSettings> databaseSettings)
        {
            MongoClient mongoClient = new MongoClient(MongoClientSettings.FromUrl(new MongoUrl(databaseSettings.Value.ConnectionString)));
            var database = mongoClient.GetDatabase(databaseSettings.Value.DatabaseName);
            _users = database.GetCollection<User>(databaseSettings.Value.UserCollectionName);
        }

        // Get one user
        public async Task<User?> GetAsync(string id) =>
            await _users.Find(x => x.Id == id).FirstOrDefaultAsync();

        public async Task<User?> GetAsyncWithQuery(FilterDefinition<User>? query) =>
            await _users.Find(query).FirstOrDefaultAsync();

        // Create user
        public async Task CreateAsync(User user) =>
            await _users.InsertOneAsync(user);

        // Delete user
        public async Task RemoveAsync(string id) =>
            await _users.DeleteOneAsync(x => x.Id == id);

        // Update user
        public async Task UpdateAsync(string id, UserData userData)
        {
            var updateDefinitionBuilder = Builders<User>.Update;

            var data = await _users.Find(x => x.Id == id).FirstOrDefaultAsync();

            var updateDefinition = updateDefinitionBuilder
                .Set(u => u.Nickname, userData.Nickname ?? data.Nickname)
                .Set(u => u.Status, userData.Status ?? data.Status)
                .Set(u => u.AvatarUrl, userData.AvatarUrl ?? data.AvatarUrl)
                .Set(u => u.PictureUrl, userData.PictureUrl ?? data.PictureUrl)
                .Set(u => u.SocialAccounts, userData.SocialAccounts ?? data.SocialAccounts)
                .Set(u => u.Bio, userData.Bio ?? data.Bio)
                .Set(u => u.ColorScheme, userData.ColorScheme ?? data.ColorScheme);

            var filter = Builders<User>.Filter.Eq(u => u.Id, id);

            await _users.UpdateOneAsync(filter, updateDefinition);
        }

        // Update password
        public async Task UpdatePasswordAsync(string id, string password)
        {
            var updateDefinitionBuilder = Builders<User>.Update;

            var data = await _users.Find(x => x.Id == id).FirstOrDefaultAsync();

            var updateDefinition = updateDefinitionBuilder
                .Set(u => u.Password, password);

            var filter = Builders<User>.Filter.Eq(u => u.Id, id);

            await _users.UpdateOneAsync(filter, updateDefinition);
        }

        // Get all of the users
        public async Task<List<User>> GetAsync() =>
            await _users.Find(_ => true).ToListAsync();
    }
}
