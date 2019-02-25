import { expect } from 'chai';
import SettingsApi from 'Src/apis/settings.js';
import optionsExample from 'Src/options.example.js';

describe('The Settings API ', () => {
  let settingsApi;
  beforeEach(function() {
    settingsApi = new SettingsApi(optionsExample);
  });

	it('should instantiate', () => {
    expect(settingsApi).to.be.instanceOf(SettingsApi);
  });
});