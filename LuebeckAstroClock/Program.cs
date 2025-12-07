
var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

// 1. Definiert, dass der Server nach Standarddateien (index.html) suchen soll.
//    WICHTIG: DIES MUSS ZUERST KOMMEN!
app.UseDefaultFiles();

// 2. Erlaubt dem Server, ALLE statischen Dateien (aus wwwroot) auszuliefern.
app.UseStaticFiles();

app.Run();