class PathSelector {
  selectPath(paths: any[]) {
    return paths.reduce((selectedPath, path) => {
      if (selectedPath == null) {
        return path;
      } else {
        if (path.unk < selectedPath.unk) return path;
        if (path.unk === selectedPath.unk) {
          if (path.mw < selectedPath.mw) return path;
          if (path.mw == selectedPath.mw) {
            if (path.w < selectedPath.w) return path;
          }
        }
        return selectedPath;
      }
    }, null);
  }

  createPath() {
    return [{ p: null, w: 0, unk: 0, type: 'INIT', mw: 0 }];
  }
}

export default PathSelector;
