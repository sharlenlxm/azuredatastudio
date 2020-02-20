/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as assert from 'assert';
import { URI as uri } from 'vs/base/common/uri';
import { IModelService } from 'vs/editor/common/services/modelService';
import { ModelServiceImpl } from 'vs/editor/common/services/modelServiceImpl';
import { IConfigurationService } from 'vs/platform/configuration/common/configuration';
import { TestConfigurationService } from 'vs/platform/configuration/test/common/testConfigurationService';
import { TestInstantiationService } from 'vs/platform/instantiation/test/common/instantiationServiceMock';
import { IFileMatch, ITextSearchMatch, OneLineRange, QueryType, SearchSortOrder } from 'vs/workbench/services/search/common/search';
import { IWorkspaceContextService } from 'vs/platform/workspace/common/workspace';
import { TestWorkspace } from 'vs/platform/workspace/test/common/testWorkspace';
import { FileMatch, Match, searchMatchComparer, SearchResult } from 'vs/workbench/contrib/search/common/searchModel';
import { TestContextService } from 'vs/workbench/test/browser/workbenchTestServices';
import { isWindows } from 'vs/base/common/platform';

suite('Search - Viewlet', () => {
	let instantiation: TestInstantiationService;

	setup(() => {
		instantiation = new TestInstantiationService();
		instantiation.stub(IModelService, stubModelService(instantiation));
		instantiation.set(IWorkspaceContextService, new TestContextService(TestWorkspace));
	});

	test('Data Source', function () {
		let result: SearchResult = instantiation.createInstance(SearchResult, null);
		result.query = {
			type: QueryType.Text,
			contentPattern: { pattern: 'foo' },
			folderQueries: [{
				folder: uri.parse('file://c:/')
			}]
		};

		result.add([{
			resource: uri.parse('file:///c:/foo'),
			results: [{
				preview: {
					text: 'bar',
					matches: {
						startLineNumber: 0,
						startColumn: 0,
						endLineNumber: 0,
						endColumn: 1
					}
				},
				ranges: {
					startLineNumber: 1,
					startColumn: 0,
					endLineNumber: 1,
					endColumn: 1
				}
			}]
		}]);

		let fileMatch = result.matches()[0];
		let lineMatch = fileMatch.matches()[0];

		assert.equal(fileMatch.id(), 'file:///c%3A/foo');
		assert.equal(lineMatch.id(), 'file:///c%3A/foo>[2,1 -> 2,2]b');
	});

	test('Comparer', () => {
		let fileMatch1 = aFileMatch(isWindows ? 'C:\\foo' : '/c/foo');
		let fileMatch2 = aFileMatch(isWindows ? 'C:\\with\\path' : '/c/with/path');
		let fileMatch3 = aFileMatch(isWindows ? 'C:\\with\\path\\foo' : '/c/with/path/foo');
		let lineMatch1 = new Match(fileMatch1, ['bar'], new OneLineRange(0, 1, 1), new OneLineRange(0, 1, 1));
		let lineMatch2 = new Match(fileMatch1, ['bar'], new OneLineRange(0, 1, 1), new OneLineRange(2, 1, 1));
		let lineMatch3 = new Match(fileMatch1, ['bar'], new OneLineRange(0, 1, 1), new OneLineRange(2, 1, 1));

		assert(searchMatchComparer(fileMatch1, fileMatch2) < 0);
		assert(searchMatchComparer(fileMatch2, fileMatch1) > 0);
		assert(searchMatchComparer(fileMatch1, fileMatch1) === 0);
		assert(searchMatchComparer(fileMatch2, fileMatch3) < 0);

		assert(searchMatchComparer(lineMatch1, lineMatch2) < 0);
		assert(searchMatchComparer(lineMatch2, lineMatch1) > 0);
		assert(searchMatchComparer(lineMatch2, lineMatch3) === 0);
	});

	test('Advanced Comparer', () => {
		let fileMatch1 = aFileMatch(isWindows ? 'C:\\with\\path\\foo10' : '/c/with/path/foo10');
		let fileMatch2 = aFileMatch(isWindows ? 'C:\\with\\path2\\foo1' : '/c/with/path2/foo1');
		let fileMatch3 = aFileMatch(isWindows ? 'C:\\with\\path2\\bar.a' : '/c/with/path2/bar.a');
		let fileMatch4 = aFileMatch(isWindows ? 'C:\\with\\path2\\bar.b' : '/c/with/path2/bar.b');

		// By default, path < path2
		assert(searchMatchComparer(fileMatch1, fileMatch2) < 0);
		// By filenames, foo10 > foo1
		assert(searchMatchComparer(fileMatch1, fileMatch2, SearchSortOrder.FileNames) > 0);
		// By type, bar.a < bar.b
		assert(searchMatchComparer(fileMatch3, fileMatch4, SearchSortOrder.Type) < 0);
	});

	function aFileMatch(path: string, searchResult?: SearchResult, ...lineMatches: ITextSearchMatch[]): FileMatch {
		let rawMatch: IFileMatch = {
			resource: uri.file(path),
			results: lineMatches
		};
		return instantiation.createInstance(FileMatch, null, null, null, searchResult, rawMatch);
	}

	function stubModelService(instantiationService: TestInstantiationService): IModelService {
		instantiationService.stub(IConfigurationService, new TestConfigurationService());
		return instantiationService.createInstance(ModelServiceImpl);
	}
});
