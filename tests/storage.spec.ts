import { test, expect } from '@playwright/test';
test('tabs preserve a dish change and service note together',async({page})=>{
  const other=await page.context().newPage();await page.goto('/admin/menu');await other.goto('/admin/operations');
  await other.getByLabel('Service notes',{exact:true}).fill('Sample concurrent note');
  await Promise.all([page.getByRole('button',{name:'Mark unavailable: Whipped feta & warm pita',exact:true}).click(),other.getByRole('button',{name:'Save notes'}).click()]);
  await expect.poll(()=>page.evaluate(()=>{const state=JSON.parse(localStorage.getItem('ember-olive-demo-v1')||'null');return state?.dishes[0].available===false&&state.notes==='Sample concurrent note';})).toBe(true);
});
test('invalid saved JSON stays recoverable and does not blank the menu',async({page})=>{
  await page.goto('/menu');await page.evaluate(()=>localStorage.setItem('ember-olive-demo-v1','{invalid'));await page.reload();
  await expect(page.getByRole('alert')).toContainText('previous data is retained');
  await expect(page.getByRole('heading',{name:'Whipped feta & warm pita'})).toBeVisible();
  const download=page.waitForEvent('download');await page.getByRole('button',{name:'Download saved data'}).click();expect((await download).suggestedFilename()).toContain('recovery.json');
});
