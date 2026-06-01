import Link from "next/link";
import { getCivilization } from "@/data";

export default async function CivPage({
  params,
}: {
  params: Promise<{ civId: string }>;
}) {
  const { civId } = await params;
  const civ = getCivilization(civId);

  if (!civ) {
    return (
      <main className="container">
        <p>
          文明が見つかりません。<Link href="/wiki">wiki へ戻る</Link>
        </p>
      </main>
    );
  }

  return (
    <main className="container">
      <div className="row">
        <h1 style={{ margin: 0 }}>{civ.name}</h1>
        <div className="spacer" />
        <Link href="/wiki" className="btn">
          ← wiki
        </Link>
      </div>

      <div className="card">
        <h3>文明特性：{civ.ability.name}</h3>
        <p style={{ margin: 0 }}>{civ.ability.description}</p>
      </div>

      <h2>指導者</h2>
      {civ.leaders.map((l) => (
        <div className="card" key={l.id}>
          <h3>{l.name}</h3>
          <p>
            <strong>能力：{l.ability.name}</strong>
            <br />
            {l.ability.description}
          </p>
          {l.agenda && (
            <p style={{ margin: 0 }}>
              <strong>アジェンダ：{l.agenda.name}</strong>
              <br />
              {l.agenda.description}
            </p>
          )}
        </div>
      ))}

      <h2>固有ユニット</h2>
      {civ.uniqueUnits.map((u) => (
        <div className="card" key={u.name}>
          <h3>{u.name}</h3>
          <p style={{ margin: 0 }}>{u.description}</p>
        </div>
      ))}

      <h2>固有施設</h2>
      {civ.uniqueInfrastructure.map((u) => (
        <div className="card" key={u.name}>
          <h3>
            {u.name}
            {u.replaces && `（${u.replaces}を置換）`}
          </h3>
          <p style={{ margin: 0 }}>{u.description}</p>
        </div>
      ))}
    </main>
  );
}
