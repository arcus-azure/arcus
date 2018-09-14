using System.IO;
using Arcus.Tools.Repository.App.Model;
using Arcus.Tools.Repository.App.Yaml;

namespace Arcus.Tools.Repository.App.Configuration
{
    public class ConfigurationProvider
    {
        public static RepositoryConfiguration Get(string configurationFilePath)
        {
            var rawConfigurationYaml = File.ReadAllText(configurationFilePath);

            var repositoryConfiguration = YamlDeserializer.ToObject<RepositoryConfiguration>(rawConfigurationYaml);
            return repositoryConfiguration;
        }
    }
}