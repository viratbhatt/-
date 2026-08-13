import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="home-page">
      <main className="home-content">
        <section className="features-grid">
          <article className="feature-card">
            <h3>Browse</h3>
            <p>Explore a collection of Pokémon from the PokéAPI.</p>
          </article>
          <article className="feature-card">
            <h3>Search</h3>
            <p>Find your favorites quickly with the search bar.</p>
          </article>
          <article className="feature-card">
            <h3>Learn</h3>
            <p>View detailed stats for every Pokémon including type, height, and weight.</p>
          </article>
        </section>

        <div className="home-actions">
          <Link to="/pokemon" className="btn btn-primary">
            View All Pokémon →
          </Link>
        </div>
      </main>
    </div>
  )
}
