import { test, expect } from '@playwright/test';

test.describe('Komplexní uživatelský scénář (Jídelníček)', () => {
  test('Uživatel se přihlásí, přidá suroviny a zkontroluje nákupní seznam', async ({ page }) => {
    await page.goto('/login');
    
    const testEmail = process.env.TEST_EMAIL || 'prase@soldan.cz';
    const testPassword = process.env.TEST_PASSWORD || '123456';
    
    await page.fill('input[type="email"]', testEmail);
    await page.fill('input[type="password"]', testPassword);
    await page.click('button[type="submit"]');

    await page.waitForURL('**/home', { timeout: 10000 });

    await page.goto('/fridge');
    
    const addInput = page.getByPlaceholder('Add to fridge...');
    await addInput.fill('apple');
    
    const plusButton = page.getByRole('button', { name: '+' });
    await plusButton.click();
    await plusButton.click();
    
    const addButton = page.getByRole('button', { name: 'Add' });
    await addButton.click();

    await addInput.fill('milk');
    await addInput.press('Enter');

    const findRecipesBtn = page.getByRole('button', { name: 'Find recipes ->' });
    await findRecipesBtn.click();
    await page.waitForURL('**/recipes', { timeout: 10000 });

    await expect(page.locator('h2')).toContainText('Cookbook');
    
    const searchByFridgeBtn = page.getByRole('button', { name: '🔍 Search by fridge' });
    await searchByFridgeBtn.click();

    await expect(page.locator('h2')).toContainText('Find Recipes');

    await expect(page.getByText('Searching for recipes from your fridge...')).toBeHidden({ timeout: 15000 });

    const shoppingListBtn = page.getByRole('button', { name: 'Shopping list' });
    await shoppingListBtn.click();
    await page.waitForURL('**/shoppingList', { timeout: 10000 });
    
    const shopInput = page.getByPlaceholder('Add to shopping list...');
    await shopInput.fill('bread');
    
    const shopPlus = page.getByRole('button', { name: '+' });
    await shopPlus.click();
    
    const shopAdd = page.getByRole('button', { name: 'Add' });
    await shopAdd.click();
  });
});
