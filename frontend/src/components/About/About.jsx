import "./about.css";

const About = () => {
  return (
    <div className="upper-container">
      <div className="about-container">
        <div className="about-text">
          <h1>Anleitung zur Verwendung von StuffIt</h1>
          <p>
            StuffIt ist eine benutzerfreundliche Webanwendung, die das Prinzip
            des Cash Stuffing übernimmt. Mit StuffIt können Benutzer ihre
            finanziellen Ressourcen effektiv verwalten, indem sie Geld in
            verschiedene Kategorien aufteilen, individuelle Budgets festlegen
            und Ausgaben verfolgen. In dieser Anleitung werden die Funktionen
            und Schritte zur Nutzung von StuffIt erklärt.
          </p>
          <h3>Funktionen und Möglichkeiten für Benutzer</h3>
          <ul className="no-list-style">
            <h4>1. Registrierung und Anmeldung</h4>
            <li>
              Registrierung: Neue Benutzer können sich einfach registrieren,
              indem sie ihre grundlegenden Informationen eingeben und ein Konto
              erstellen. Anmeldung: Nach der Registrierung können sich Benutzer
              mit ihren Anmeldeinformationen anmelden, um auf ihr Konto
              zuzugreifen.
            </li>
            <h4>2. Erstellung von Kategorien und Budgets</h4>
            <li>
              Kategorien erstellen: Benutzer können ihre Finanzen in
              verschiedene Kategorien wie "Lebensmittel", "Miete",
              "Unterhaltung", "Transport" usw. aufteilen. Budgets festlegen: Für
              jede Kategorie können Benutzer individuelle Budgets festlegen, um
              festzulegen, wie viel Geld sie für bestimmte Ausgabenkategorien
              ausgeben möchten. (Maximal 24 Kategorien)
            </li>
            <h4>3. Verwaltung von Ausgaben</h4>
            <li>
              Ausgaben erfassen: Benutzer können ihre Ausgaben in Echtzeit
              erfassen und den entsprechenden Kategorien zuordnen. Ausgaben
              verfolgen: StuffIt bietet eine übersichtliche Darstellung der
              Ausgaben, die es den Benutzern ermöglicht, ihre Ausgaben im
              Vergleich zu ihren Budgets zu verfolgen.
            </li>
            <h4>4. Verbindung zwischen Benutzern</h4>
            <li>
              Familienkonto: Benutzer können Familienmitglieder einladen, sich
              an einem gemeinsamen StuffIt-Konto anzumelden. Der Administrator
              des Kontos kann die Gesamtbudgets festlegen und die Budgets für
              einzelne Kategorien zuweisen.
            </li>
            <h4>5. Nutzung des Gastprofils (noch in Arbeit)</h4>
            <li>
              Gastprofil: StuffIt bietet ein Gastprofil mit begrenzten
              Funktionen, das es Benutzern ermöglicht, die grundlegenden
              Funktionen der Webanwendung kennenzulernen.
            </li>
            <h4>6. Flexibilität und Anpassung</h4>
            <li>
              Anpassung: Benutzer können ihre Kategorien und Budgets jederzeit
              anpassen, um ihre finanziellen Ziele und Bedürfnisse zu erfüllen.
              Mobiler Zugriff: StuffIt ist auch auf mobilen Geräten zugänglich,
              sodass Benutzer ihre Finanzen auch unterwegs verwalten können.
            </li>
          </ul>
          <h4>Schritte zur Verwendung von StuffIt</h4>
          <p>
            Registrierung oder Anmeldung: Besuchen Sie die StuffIt-Website und
            registrieren Sie sich für ein Konto oder melden Sie sich mit Ihren
            vorhandenen Anmeldeinformationen an.
          </p>
          <h4>Erstellung von Kategorien und Budgets:</h4>
          <ul className="different-list-style">
            <li>
              Teilen Sie Ihre Finanzen in verschiedene Kategorien auf und legen
              Sie individuelle Budgets fest.
            </li>
            <li>
              Verwaltung Ihrer Ausgaben: Erfassen Sie Ihre Ausgaben und behalten
              Sie den Überblick über Ihre finanzielle Situation.
            </li>
            <li>
              Einladung von Familienmitgliedern: Laden Sie Familienmitglieder
              ein, sich an Ihrem StuffIt-Konto anzumelden und gemeinsam
              finanzielle Ziele zu erreichen.
            </li>
            <li>
              Nutzung des Gastprofils (noch in Arbeit): Erforschen Sie die
              Grundfunktionen von StuffIt mit dem Gastprofil.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default About;
