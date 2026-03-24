import { format } from "date-fns";

const quotes = [
  { text: "הדרך היחידה לעשות עבודה נהדרת היא לאהוב את מה שאתה עושה.", author: "סטיב ג׳ובס" },
  { text: "בתוך כל קושי מסתתרת הזדמנות.", author: "אלברט איינשטיין" },
  { text: "העתיד שייך לאלו שמאמינים ביופי של חלומותיהם.", author: "אלינור רוזוולט" },
  { text: "לא החזק שורד, ולא החכם, אלא מי שמסתגל לשינויים.", author: "צ׳ארלס דרווין" },
  { text: "הזמן הטוב ביותר לשתול עץ היה לפני 20 שנה. הזמן הטוב השני הוא עכשיו.", author: "פתגם סיני" },
  { text: "מה שאנו יודעים הוא טיפה, מה שאיננו יודעים הוא אוקיינוס.", author: "אייזק ניוטון" },
  { text: "מדע הוא ידע מאורגן. חוכמה היא חיים מאורגנים.", author: "עמנואל קאנט" },
];

const getDailyQuote = () => {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  return quotes[dayOfYear % quotes.length];
};

const hebrewDays: Record<string, string> = {
  Sunday: "יום ראשון",
  Monday: "יום שני",
  Tuesday: "יום שלישי",
  Wednesday: "יום רביעי",
  Thursday: "יום חמישי",
  Friday: "יום שישי",
  Saturday: "שבת",
};

const hebrewMonths: Record<string, string> = {
  January: "ינואר", February: "פברואר", March: "מרץ", April: "אפריל",
  May: "מאי", June: "יוני", July: "יולי", August: "אוגוסט",
  September: "ספטמבר", October: "אוקטובר", November: "נובמבר", December: "דצמבר",
};

const DailyHeader = () => {
  const today = new Date();
  const quote = getDailyQuote();
  const dayName = hebrewDays[format(today, "EEEE")] || format(today, "EEEE");
  const month = hebrewMonths[format(today, "MMMM")] || format(today, "MMMM");

  return (
    <header className="text-center py-10 md:py-14">
      <p className="category-label mb-2">{dayName}</p>
      <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-1">
        הסקירה היומית
      </h1>
      <p className="font-sans text-sm text-subtext mb-8">
        {format(today, "d")} ב{month} {format(today, "yyyy")}
      </p>
      <div className="editorial-divider max-w-xs mx-auto mb-6" />
      <blockquote className="max-w-lg mx-auto italic text-muted-foreground text-base md:text-lg leading-relaxed">
        &ldquo;{quote.text}&rdquo;
      </blockquote>
      <p className="font-sans text-xs text-subtext mt-2">— {quote.author}</p>
    </header>
  );
};

export default DailyHeader;
