using System.Collections.Generic;

namespace Arcus.Tools.Repository.App.Model
{
    public class Issue
    {
        public string Description { get; set; }
        public List<string> Labels { get; set; }
        public string MilestoneName { get; set; }
        public string Title { get; set; }
    }
}