function IndiceCapitoliParagrafi({ capitoli }) {
  return (
    <ul className="bg-white p-4 ">
      {capitoli.map((capitolo) => (
        <li key={capitolo.id} className="m-0">
          <a
            href={`#${capitolo.id}`}
            className="text-black hover:underline text-sm font-bold"
          >
            {capitolo.id} - {capitolo.nomeCapitolo || "Nessun nome capitolo"}
          </a>
          <ul className="pl-4 bg-white">
            {capitolo.paragrafi.map((paragrafo) => (
              <li key={paragrafo.id} className="m-0">
                <a
                  href={`#${paragrafo.id}`}
                  className="text-black hover:underline text-xs italic"
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
