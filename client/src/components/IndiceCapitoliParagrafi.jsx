function IndiceCapitoliParagrafi({ capitoli }) {
  return (
    <ul className="bg-white p-4">
      {capitoli.map((capitolo) => (
        <li key={capitolo.id} className="mb-2">
          <a
            href={`#${capitolo.id}`}
            className="text-blue-600 hover:underline text-sm"
          >
            {capitolo.id} - {capitolo.nomeCapitolo || "Nessun nome capitolo"}
          </a>
          <ul className="pl-4 bg-white">
            {capitolo.paragrafi.map((paragrafo) => (
              <li key={paragrafo.id} className="mb-2">
                <a
                  href={`#${paragrafo.id}`}
                  className="text-blue-600 hover:underline text-xs"
                >
                  {paragrafo.id} - {paragrafo.nomeParagrafo}
                </a>
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
}

export default IndiceCapitoliParagrafi;
