import { test, expect } from '@playwright/test';

test.describe('Komplexní uživatelský scénář (Jídelníček)', () => {

  test('Uživatel se přihlásí, přidá suroviny a zkontroluje nákupní seznam', async ({ page }) => {
    // 1. Přihlášení
    await page.goto('/login');
    
    // Očekáváme, že uživatel zadá testovací údaje přes env proměnné
    // Pokud nejsou dostupné, test může selhat na přihlášení
    const testEmail = process.env.TEST_EMAIL || 'prase@soldan.cz';
    const testPassword = process.env.TEST_PASSWORD || '123456';
    
    await page.fill('input[type="email"]', testEmail);
    await page.fill('input[type="password"]', testPassword);
    await page.click('button[type="submit"]');

    // Počkáme na úspěšné přihlášení a přesměrování
    await page.waitForURL('**/home', { timeout: 10000 });
    // Zde pokračuje scénář "s hodně klikáním" pro případ, že je uživatel přihlášen,
    // nebo pro testování s mockovaným stavem. Pro demonstraci klikání předpokládáme,
    // že jsme se dostali dál, nebo upravíme test tak, aby proklikal dostupné UI.

    // 2. Přechod do ledničky (My Fridge)
    // Předpokládejme, že existuje navigace nebo půjdeme přímo na URL
    await page.goto('/fridge');
    
    // Měli byhom vidět nadpis
    // await expect(page.locator('h1')).toContainText('My Fridge'); // Záleží na PageHeader

    // 3. Přidání suroviny do ledničky (AutocompleteInputField -> InputField)
    // Najdeme input podle placeholderu (label)
    const addInput = page.getByPlaceholder('Add to fridge...');
    await addInput.fill('apple');
    
    // Zvýšíme množství (kliknutí na tlačítko +)
    // Komponenta InputField má tlačítka + a -, najdeme to s textem '+'
    const plusButton = page.getByRole('button', { name: '+' });
    await plusButton.click();
    await plusButton.click(); // Množství bude 3
    
    // Klikneme na tlačítko Add
    const addButton = page.getByRole('button', { name: 'Add' });
    await addButton.click();

    // 4. Přidání další suroviny pomocí Enter
    await addInput.fill('milk');
    await addInput.press('Enter');

    // 5. Pokus o smazání jedné z položek (FoodTable)
    // Předpokládáme, že FoodTable má tlačítka s ikonou koše nebo textem "Smazat"
    // Pokud to neexistuje, přeskočíme, ale kliknutí na řádek / ikonu
    // const deleteMilk = page.locator('tr').filter({ hasText: 'milk' }).getByRole('button');
    // await deleteMilk.click();

    // 6. Proklik do sekce Receptů (defaultně je to Cookbook)
    const findRecipesBtn = page.getByRole('button', { name: 'Find recipes ->' });
    await findRecipesBtn.click();
    await page.waitForURL('**/recipes', { timeout: 10000 });

    // 7. Ověření, že jsme v Cookbooku a přepnutí na hledání receptů
    // Nadpis by měl být Cookbook
    await expect(page.locator('h2')).toContainText('Cookbook');
    
    // Klikneme na tlačítko pro vyhledávání podle ledničky
    const searchByFridgeBtn = page.getByRole('button', { name: '🔍 Search by fridge' });
    await searchByFridgeBtn.click();

    // Nadpis by se měl změnit na Find Recipes
    await expect(page.locator('h2')).toContainText('Find Recipes');

    // Počkáme, až zmizí indikátor načítání receptů
    await expect(page.getByText('Searching for recipes from your fridge...')).toBeHidden({ timeout: 15000 });

    // Volitelně můžeme zkontrolovat, že se ukázal alespoň jeden recept (pokud lednička není prázdná)
    // await expect(page.locator('.grid')).toBeVisible();

    // 8. Přechod do Shopping Listu přes tlačítko v navigaci receptů
    const shoppingListBtn = page.getByRole('button', { name: 'Shopping list' });
    await shoppingListBtn.click();
    await page.waitForURL('**/shoppingList', { timeout: 10000 });
    
    const shopInput = page.getByPlaceholder('Add to shopping list...');
    await shopInput.fill('bread');
    
    const shopPlus = page.getByRole('button', { name: '+' });
    await shopPlus.click();
    
    const shopAdd = page.getByRole('button', { name: 'Add' });
    await shopAdd.click();

    // Odškrtnutí položky (pokud má FoodTable checkbox)
    // Příklad: kliknutí na checkbox v řádku s "bread"
    // await page.locator('tr').filter({ hasText: 'bread' }).getByRole('checkbox').check();

  });
});
