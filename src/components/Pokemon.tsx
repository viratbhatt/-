import { useEffect, useMemo, useState } from 'react'

interface PokemonSummary {
  name: string
  url: string
}

interface Stat {
  base_stat: number
  stat: {
    name: string
  }
}

interface PokemonSpriteData {
  front_default: string | null
  other?: {
    showdown?: { front_default?: string | null }
    dream_world?: { front_default?: string | null }
    "official-artwork": { front_default?: string | null }
  }
}

interface PokemonDetail {
  id: number
  name: string
  sprites: PokemonSpriteData
  types: { type: { name: string } }[]
  stats: Stat[]
  height: number
  weight: number
}

const PAGE_SIZE = 12

function getTypeColors(primaryType: string): { bgGradient: string; accentColor: string } {
  const typeColors: Record<string, { bgGradient: string; accentColor: string }> = {
    normal: { bgGradient: 'linear-gradient(135deg, #f8f9fa 0%, #bedeff 100%)', accentColor: '#0c275e' },
    fire: { bgGradient: 'linear-gradient(135deg, #fff5f2 0%, #ffedd5 100%)', accentColor: '#ef4444' },
    water: { bgGradient: 'linear-gradient(135deg, #f0f9ff 0%, #dbeafe 100%)', accentColor: '#3b82f6' },
    electric: { bgGradient: 'linear-gradient(135deg, #fffbeb 0%, #fef08a 100%)', accentColor: '#eab308' },
    grass: { bgGradient: 'linear-gradient(135deg, #f0fdf4 0%, #bbf7d0 100%)', accentColor: '#22c55e' },
    ice: { bgGradient: 'linear-gradient(135deg, #f0f9ff 0%, #cffafe 100%)', accentColor: '#06b6d4' },
    fighting: { bgGradient: 'linear-gradient(135deg, #fef2f2 0%, #fecaca 100%)', accentColor: '#dc2626' },
    poison: { bgGradient: 'linear-gradient(135deg, #faf5ff 0%, #e9d5ff 100%)', accentColor: '#a855f7' },
    ground: { bgGradient: 'linear-gradient(135deg, #fffbeb 0%, #fed7aa 100%)', accentColor: '#f97316' },
    flying: { bgGradient: 'linear-gradient(135deg, #f0f9ff 0%, #6bc2fd 100%)', accentColor: '#0ea5e9' },
    psychic: { bgGradient: 'linear-gradient(135deg, #fdf4ff 0%, #fce7f3 100%)', accentColor: '#ec4899' },
    bug: { bgGradient: 'linear-gradient(135deg, #fcfce8 0%, #fef08a 100%)', accentColor: '#ca8a04' },
    rock: { bgGradient: 'linear-gradient(135deg, #fafaf9 0%, #d6d3d1 100%)', accentColor: '#78716c' },
    ghost: { bgGradient: 'linear-gradient(135deg, #f5f5f4 0%, #e7e5e4 100%)', accentColor: '#57534e' },
    dragon: { bgGradient: 'linear-gradient(135deg, #faf5ff 0%, #ddd6fe 100%)', accentColor: '#8b5cf6' },
    dark: { bgGradient: 'linear-gradient(135deg, #b6b6bd 0%, #808095 100%)', accentColor: '#14416f' },
    steel: { bgGradient: 'linear-gradient(135deg, #f4f4f5 0%, #e4e4e7 100%)', accentColor: '#71717a' },
    fairy: { bgGradient: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%)', accentColor: '#ec4899' },
  }
  return typeColors[primaryType] || { bgGradient: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)', accentColor: '#64748b' }
}

function Pokemon() {
  const [pokemonList, setPokemonList] = useState<PokemonSummary[]>([])
  const [details, setDetails] = useState<Record<string, PokemonDetail>>(() => {
    try {
      const stored = localStorage.getItem('pokemon-details-cache')
      return stored ? JSON.parse(stored) : {}
    } catch {
      return {}
    }
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (pokemonList.length > 0 || loading) return

    const loadList = async () => {
      setLoading(true)
      try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1000')
        const data = await response.json()
        setPokemonList(data.results)
      } catch {
        setError('Failed to load Pokémon list.')
      } finally {
        setLoading(false)
      }
    }

    void loadList()
  }, [loading, pokemonList.length])

  const filteredList = useMemo(() => {
    const lowerSearch = searchTerm.trim().toLowerCase()
    if (!lowerSearch) return pokemonList

    return pokemonList.filter((pokemon) => {
      const urlParts = pokemon.url.split('/').filter(Boolean)
      const id = urlParts[urlParts.length - 1] ?? ''
      return pokemon.name.toLowerCase().includes(lowerSearch) || id.includes(lowerSearch)
    })
  }, [pokemonList, searchTerm])

  const pageCount = Math.max(1, Math.ceil(filteredList.length / PAGE_SIZE))

  const visiblePokemon = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    return filteredList.slice(start, start + PAGE_SIZE)
  }, [filteredList, page])

  useEffect(() => {
    if (visiblePokemon.length === 0) return

    const missing = visiblePokemon.filter((pokemon) => !details[pokemon.name])
    if (missing.length === 0) return

    const loadDetails = async () => {
      try {
        const responses = await Promise.all(
          missing.map((pokemon) => fetch(pokemon.url).then((res) => res.json())),
        )

        setDetails((current) => {
          const next = { ...current }
          for (const detail of responses) {
            next[detail.name] = detail
          }
          return next
        })
      } catch {
        setError('Failed to load Pokémon details.')
      }
    }

    void loadDetails()
  }, [details, visiblePokemon])

  useEffect(() => {
    try {
      localStorage.setItem('pokemon-details-cache', JSON.stringify(details))
    } catch {
      // Ignore storage write errors.
    }
  }, [details])

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
    setPage(1)
  }

  return (
    <div className="app-shell">
      <header className="hero-card">
        <div>
          <h1>Pokémon Explorer</h1>
          <p>Search, browse, and view Pokémon stats from the PokéAPI.</p>
        </div>

        <div className="search-input-container">
          <input
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search Pokémon by name or ID"
            className="search-input"
            aria-label="Search Pokémon"
          />
          <img
            src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/6.gif"
            alt="Scanning"
            className="pokemon-scan-gif"
          />
        </div>
      </header>

      {error && <div className="toast error">{error}</div>}

      <section className="summary-row">
        <span>{filteredList.length} Pokémon found</span>
        <span>Page {page} of {pageCount}</span>
      </section>

      {loading ? (
        <div className="status">Loading Pokémon…</div>
      ) : filteredList.length === 0 ? (
        <div className="status">No Pokémon match your search.</div>
      ) : (
        <div className="grid-list">
          {visiblePokemon?.map((pokemon) => {
            const detail = details[pokemon.name]
            const primaryType = detail?.types?.[0]?.type.name || 'normal'
            const colors = getTypeColors(primaryType)
          
            const spriteUrl =
              detail?.sprites?.other?.["official-artwork"]?.front_default ??
              detail?.sprites?.other?.dream_world?.front_default ??
              detail?.sprites?.front_default ??
              ''

            return (
              <article
                key={pokemon.name}
                className="pokemon-card"
                style={{
                  minWidth: '350px',
                  background: colors.bgGradient,
                  borderColor: `${colors.accentColor}50`,
                  borderWidth: '2px',
                  borderStyle: 'ridge',
                  backgroundColor: `${colors.accentColor}100`,
                  boxShadow: `4px 4px 10px 4px ${colors.accentColor}80,  4px 4px 4px 4px ${colors.accentColor}10`,
                }}
              >
                <div className="card-header">
                  <div className="pokemon-id" style={{ color: colors.accentColor }}>
                    #{detail?.id ?? '??'}
                  </div>
                  <h2>{pokemon.name}</h2>
                </div>

                <div className="sprite-wrap">
                  {spriteUrl ? (
                    <img
                      src={spriteUrl}
                      alt={pokemon.name}
                      width={220}
                      height={220}
                      style={{
                        filter: 'drop-shadow(0 30px 18px rgba(15, 23, 42, 0.5))',
                        background: 'transparent',
                        borderRadius: 0,
                        display: 'block',
                      }}
                    />
                  ) : (
                    <div className="sprite-placeholder">No image</div>
                  )}
                </div>

                {detail ? (
                  <div className="card-body">
                    <div className="type-list">
                      {detail.types.map((entry) => (
                        <span key={entry.type.name} className="type-pill">
                          {entry.type.name}
                        </span>
                      ))}
                    </div>

                    <dl className="stat-list">
                      {detail.stats.map((stat) => (
                        <div key={stat.stat.name} className="stat-item">
                          <dt>{stat.stat.name}</dt>
                          <dd>{stat.base_stat}</dd>
                        </div>
                      ))}
                    </dl>

                    <div className="misc-row">
                      <span>Height: {detail.height}</span>
                      <span>Weight: {detail.weight}</span>
                    </div>
                  </div>
                ) : (
                  <div className="loading-card">Loading details…</div>
                )}
              </article>
            )
          })}
        </div>
      )}

      <footer className="pagination-row">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => setPage((current) => Math.max(1, current - 1))}
        >
          Previous
        </button>
        <button
          type="button"
          disabled={page >= pageCount}
          onClick={() => setPage((current) => Math.min(pageCount, current + 1))}
        >
          Next
        </button>
      </footer>
    </div>
  )
}

export default Pokemon
