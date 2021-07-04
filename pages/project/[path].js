import fetch from 'isomorphic-unfetch';
import {
  StarIcon,
  WatchIcon,
  BugIcon,
  AzureIcon,
  GithubIcon,
  projectIcons
} from '../../components/Icons';
import { projects } from '../../utils/projectsData';

function Project({ project, path }) {
  const projectData = projects.find(project => project.slug === path);
  const Icon = projectIcons[projectData.id]
  console.log(path);
  return (
    <div className="project">
      <aside>
        
      </aside>
      <main>
        
      </main>
    </div>
  );
}

Project.getInitialProps = async function (context) {
  const { path } = context.query;
  const projectData = projects.find(project => project.slug === path);
  const ghPath = projectData.path;
  
  const res = await fetch(`https://api.github.com/repos/${ghPath}`);
  const project = await res.json();
  return { project, path };
};

export default Project;
