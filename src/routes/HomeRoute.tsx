import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useCreateProject, useProjects } from "../data/projectsQueries";
import { LoadingScreen } from "../components/LoadingScreen";
import { PageTransition } from "../components/PageTransition";

export function HomeRoute() {
  const { data: projects, isLoading } = useProjects();
  const createProject = useCreateProject();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [showForm, setShowForm] = useState(false);

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    const project = await createProject.mutateAsync({ name, address });
    navigate(`/projects/${project.id}`);
  }

  return (
    <PageTransition>
      <h1 className="page-heading">Your projects</h1>
      <p className="page-sub">Capture every room, get a 3D walkthrough, and see what your home is worth.</p>

      {isLoading ? (
        <LoadingScreen />
      ) : (
        <div className="grid grid-2" style={{ marginBottom: 24 }}>
          {projects?.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <Link to={`/projects/${p.id}`} className="card room-card">
                <div style={{ fontWeight: 700, marginBottom: 4 }}>{p.name}</div>
                <div className="muted">{p.address || "No address yet"}</div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}

      {!showForm ? (
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          + Start new project
        </button>
      ) : (
        <form className="card" onSubmit={handleCreate} style={{ maxWidth: 420 }}>
          <div className="field">
            <label htmlFor="name">Project name</label>
            <input
              id="name"
              required
              placeholder="123 Main St"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="address">Address (optional)</label>
            <input
              id="address"
              placeholder="123 Main St, Baltimore, MD"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn btn-primary" type="submit" disabled={createProject.isPending}>
              {createProject.isPending ? "Creating…" : "Create"}
            </button>
            <button type="button" className="btn btn-ghost" onClick={() => setShowForm(false)}>
              Cancel
            </button>
          </div>
        </form>
      )}
    </PageTransition>
  );
}
