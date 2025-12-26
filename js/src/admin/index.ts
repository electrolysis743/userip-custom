import app from 'flarum/admin/app';

export { default as extend } from './components/SettingsPage';

app.initializers.add('electrolysis743-userip-custom', () => {
  console.log('[electrolysis743/userip-custom] Hello, admin!');
});
