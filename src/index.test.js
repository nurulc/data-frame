import { assest, expect } from 'chai'
import * as lib from './index'

describe('Matcher', function () {
  describe('index.js', function () {

    it('should load all libraries.', function () {
      // from './claim/claim'
      expect(lib.claimLine).to.exist;
      expect(lib.Claim).to.exist;
      expect(lib.findClaim).to.exist;
      expect(lib.findMemberClaims).to.exist;
      expect(lib.toDate).to.exist;

      // from './frame/frame'
      expect(lib.arrayEqual).to.exist;
      expect(lib.arrayTally).to.exist;
      expect(lib.arrToCol).to.exist;
      expect(lib.arrayTallySorted).to.exist;
      expect(lib.arrayUniq).to.exist;
      expect(lib.frameFromBuffer).to.exist;
      expect(lib.Frame).to.exist;

      // from './metadata/matcher'
      expect(lib.extractTripple).to.exist;
      expect(lib.genFuncForPattern).to.exist;

      // from './string/csv'
      expect(lib.csvLine).to.exist;
      expect(lib.tsvLine).to.exist;
      expect(lib.psvLine).to.exist;
      expect(lib.dataSplit).to.exist;

      // from './frame/frequency'
      expect(lib.getFreq).to.exist;
      expect(lib.orderStatistic).to.exist;
      expect(lib.kSmallest).to.exist;
      expect(lib.kLargest).to.exist;
      expect(lib.getTallyFromPSV).to.exist;

      // from './array/arrayutils'
      expect(lib.newArray).to.exist;
      expect(lib.arrSplit).to.exist;
      expect(lib.arrDiff).to.exist;
      expect(lib.arrUnion).to.exist;
      expect(lib.arrIntersect).to.exist;
      expect(lib.arrDedup).to.exist;
      expect(lib.redim).to.exist;
      expect(lib.arrSum).to.exist;
      expect(lib.arrMin).to.exist;
      expect(lib.arrMax).to.exist;
      expect(lib.arrMean).to.exist;
      expect(lib.arrEqual).to.exist;
      expect(lib.arrDistinct).to.exist;
      expect(lib.arrCountVal).to.exist;
      expect(lib.reord).to.exist;
      expect(lib.flatten).to.exist;
      expect(lib.isEmpty).to.exist;

      // from './array/intset'
      expect(lib.dedupSortedArr).to.exist;
      expect(lib.hasNoDups).to.exist;
      expect(lib.asSortedSet).to.exist;
      expect(lib.intersect).to.exist;
      expect(lib.intersectL).to.exist;
      expect(lib.union).to.exist;
      expect(lib.unionL).to.exist;
      expect(lib.subtract).to.exist;
      expect(lib.findIndexOf).to.exist;

      // from './metadata/metadata'
      expect(lib.getMetadataFrame).to.exist;
      expect(lib.createCodeTables).to.exist;
      expect(lib.setDefaultAddFunction).to.exist;
      expect(lib.getDefaultAddFunction).to.exist;
      expect(lib.Metadata).to.exist;
      expect(lib.CreditTriggers).to.exist;
      expect(lib.DebitTriggers).to.exist;
      expect(lib.DebitEnablers).to.exist;

      // from './metadata/rule_flags'
      expect(lib.RL_FLAG_HCFA).to.exist;
      expect(lib.RL_FLAG_UB).to.exist;
      expect(lib.RL_FLAG_INPT).to.exist;
      expect(lib.RL_FLAG_OUTPT).to.exist;
      expect(lib.RL_FLAG_BITS).to.exist;
      expect(lib.RL_FLAG_MAX_SIZE).to.exist;

      // from './utils/objutils'
      expect(lib.memoize).to.exist;
      expect(lib.access).to.exist;
      expect(lib.setKey).to.exist;
      expect(lib.timeIt).to.exist;
      expect(lib.toKeyValueList).to.exist;
      expect(lib.fromKeyValueList).to.exist;
      expect(lib.isA).to.exist;

      // from './utils/patutils'
      expect(lib.parseCodePat).to.exist;
      expect(lib.getPrefixFromComp).to.exist;

      // from './metadata/treeutils'
      expect(lib.Tree).to.exist;
      expect(lib.CreditTree).to.exist;
      expect(lib.DebitTree).to.exist;
      expect(lib.buildTree).to.exist;

      // from './metadata/searchcode'
      expect(lib.unionLFast).to.exist;

      // from './frame/colutils'
      expect(lib.innerJoin).to.exist;
      expect(lib.fullInnerJoin).to.exist;
      expect(lib.leftJoin).to.exist;

      // from './utils/asyncprocess'
      expect(lib.forEachAsc).to.exist;
      expect(lib.forEachBase).to.exist;

      // from './string/strutil'
      expect(lib.reverse).to.exist;
      expect(lib.prefixLen).to.exist;
      expect(lib.prefixHead).to.exist;
      expect(lib.prefixTail).to.exist;
      expect(lib.prod).to.exist;
      expect(lib.getColumnStarts).to.exist;
      expect(lib.getCol).to.exist;
      expect(lib.getColStart).to.exist;
      expect(lib.getColEnd).to.exist;
      expect(lib.getColAt).to.exist;
      expect(lib.getColAtPlus).to.exist;
      expect(lib.getLine).to.exist;
      expect(lib.getLineIx).to.exist;
      expect(lib.countCh).to.exist;
      expect(lib.hash).to.exist;

      // from './frame/framehelper'
      expect(lib.identity).to.exist;
      expect(lib.MultiDict).to.exist;
      expect(lib.cmpStr).to.exist;
      expect(lib.cmpStrNum).to.exist;
      expect(lib.groupByToDict).to.exist;
      expect(lib.frameSum).to.exist;
      expect(lib.frameCount).to.exist;
      expect(lib.frameToString).to.exist;
      expect(lib.cmpNumOrStrBy).to.exist;
      expect(lib.revCmp).to.exist;
      expect(lib.combineCmp).to.exist;
      expect(lib.genColIxFunc).to.exist;
      expect(lib.sortFrameBy).to.exist;
      expect(lib.groupBy).to.exist;
      expect(lib.gbSum).to.exist;
      expect(lib.gbCount).to.exist;
      expect(lib.gbMin).to.exist;
      expect(lib.gbMax).to.exist;
      expect(lib.gbMean).to.exist;
      expect(lib.gbStdDiv).to.exist;
      expect(lib.gb).to.exist;
    });
  });
});
