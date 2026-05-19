import { test, expect } from '@playwright/test';

test.describe('True E2E Test (No Mocking)', () => {
    const BASE_URL = 'http://localhost:5173';
    // generate a timestamped name to ensure the test does not confuse with duplicate data
    const uniqueTodoName = `E2E 測試任務 - ${Date.now()}`;

    test('should be able to add and then delete a Todo', async ({ page }) => {
        // 1. go to the home page
        await page.goto(BASE_URL);

        // 2. add a Todo (real send to backend)
        await page.getByPlaceholder('Name').fill(uniqueTodoName);
        await page.getByPlaceholder('Description').fill('This is a real E2E test data');
        await page.getByRole('button', { name: 'Add Todo' }).click();

        // 3. verify that the data appears in the UI
        const todoHeading = page.getByRole('heading', { name: uniqueTodoName });
        await expect(todoHeading).toBeVisible({ timeout: 5000 });

        // 4. execute the delete action (real delete from database)
        // Find the Delete button in the container containing the title
        const todoItem = page.locator('.Card', { hasText: uniqueTodoName });
        await todoItem.getByRole('button', { name: 'Delete' }).click();

        // 5. verify that the data is removed from the UI
        await expect(todoHeading).not.toBeVisible({ timeout: 5000 });
        
        console.log('True E2E Test passed: Add and delete process works normally');
    });
});
