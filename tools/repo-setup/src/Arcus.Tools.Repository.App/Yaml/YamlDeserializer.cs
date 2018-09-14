using YamlDotNet.Serialization;
using YamlDotNet.Serialization.NamingConventions;

namespace Arcus.Tools.Repository.App.Yaml
{
    public class YamlDeserializer
    {
        public static TObject ToObject<TObject>(string rawModel)
        {
            var deserializer = new DeserializerBuilder()
                .WithNamingConvention(new CamelCaseNamingConvention())
                .Build();

            var deserializedObject = deserializer.Deserialize<TObject>(rawModel);
            return deserializedObject;
        }
    }
}