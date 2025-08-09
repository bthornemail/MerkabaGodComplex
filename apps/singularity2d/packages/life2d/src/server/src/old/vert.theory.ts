import ExamProvider from "./exam.provider/exam.provider.js";
import ServiceBoard from "./service.board/service.board.js";
import AssetManager from './asset.manager/asset.manager.js';
import UserManager from './user.manager/user.manager.js';
class VertTheory {
    userManager: UserManager;
    assetManager: AssetManager;
    serviceBoard: ServiceBoard;
    examProvider: ExamProvider;
    constructor() {
        this.userManager = new UserManager();
        this.assetManager = new AssetManager();
        this.serviceBoard = new ServiceBoard();
        this.examProvider = new ExamProvider();
    }
}
export default VertTheory;
