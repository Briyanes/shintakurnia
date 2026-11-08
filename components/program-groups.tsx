import type { Program } from "@/lib/schema";
import { learningGroups } from "@/lib/catalog";
import { ProgramCard } from "./site";
export function ProgramGroups({ programs }: { programs: Program[] }) {
  const groups = learningGroups(programs);
  return (
    <div className="learning-groups">
      {groups.map((group) => (
        <section
          key={group.id}
          className="learning-group"
          aria-labelledby={`group-${group.id}`}
        >
          <div className="learning-group-intro">
            <h3 id={`group-${group.id}`}>{group.title}</h3>
            <p>{group.description}</p>
          </div>
          <div className="program-grid">
            {group.programs.map((program, index) => (
              <ProgramCard program={program} index={index} key={program.id} />
            ))}
          </div>
        </section>
      ))}
      {!groups.length && (
        <p>
          Program sedang diperbarui. Silakan konsultasi untuk pilihan kelas.
        </p>
      )}
    </div>
  );
}
