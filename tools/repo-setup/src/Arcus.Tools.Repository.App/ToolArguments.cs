using CommandLineParser.Arguments;
using CommandLineParser.Validation;

namespace Arcus.Tools.Repository.App
{
    [ArgumentGroupCertification("u,p,r,f", EArgumentGroupCondition.AllUsed)]
    public class ToolArguments
    {
        [ValueArgument(typeof(string), 'u', "username", Description = "Name to authenticate with", Optional = false)]
        public string UserName { get; set; }

        [ValueArgument(typeof(string), 'p', "password", Description = "Password to authenticate with", Optional = false)]
        public string Password { get; set; }

        [ValueArgument(typeof(string), 'r', "repo-name", Description = "Name of the repository to configure", Optional = false)]
        public string Repository { get; set; }

        [ValueArgument(typeof(string), 'f', "configuration-file", Description = "Path to the YAML configuration file that defines all items that should be part of a new repository", Optional = false)]
        public string ConfigurationFilePath { get; set; }
    }
}