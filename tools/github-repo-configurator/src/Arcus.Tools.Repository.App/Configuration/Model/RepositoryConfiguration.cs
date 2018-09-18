using System.Collections.Generic;

namespace Arcus.Tools.Repository.App.Model
{
    public class RepositoryConfiguration
    {
        public List<Issue> Issues { get; set; }
        public List<Label> Labels { get; set; }
        public List<Milestone> Milestones { get; set; }
    }
}