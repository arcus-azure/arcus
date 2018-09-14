using CommandLineParser.Arguments;

namespace Arcus.Tools.Repository.App
{
    public class ConfigureDefaultRepositoryArguments
    {
        [SwitchArgument(shortName: 'c', longName: "configure-default", defaultValue:true, Description = "Configures the GitHub repository according to our default standards")]
        public bool ConfigureDefaults { get; set; }

        [ValueArgument(typeof(string), 'u', "username",  Description = "Name to authenticate with", Optional = false)]
        public string UserName { get; set; }

        [ValueArgument(typeof(string), 'p', "password", Description = "Password to authenticate with", Optional = false)]
        public string Password { get; set; }

        [ValueArgument(typeof(string), 'r', "repo-name",  Description = "Name of the repository to configure", Optional = false)]
        public string Repository { get; set; }
    }
}