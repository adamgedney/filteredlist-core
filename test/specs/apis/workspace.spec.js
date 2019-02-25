import { expect } from 'chai';
import WorkspaceApi from 'Src/apis/workspace.js';
import optionsExample from 'Src/options.example.js';

describe('The Workspace API ', () => {
  let workspaceApi;
  beforeEach(function() {
    workspaceApi = new WorkspaceApi(optionsExample);
  });

	it('should instantiate', () => {
    expect(workspaceApi).to.be.instanceOf(WorkspaceApi);
  });
});