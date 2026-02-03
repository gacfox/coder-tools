'use client';

import { useState } from 'react';
import { Copy, Check, ChevronDown, ChevronRight, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CommandItem {
  description: string;
  command: string;
}

interface Category {
  id: string;
  title: string;
  items: CommandItem[];
}

const gitCommands: Category[] = [
  {
    id: '创建',
    title: '创建',
    items: [
      {
        description: '复制一个已创建的仓库',
        command: 'git clone ssh://user@domain.com/repo.git',
      },
      {
        description: '创建一个新的本地仓库',
        command: 'git init',
      },
    ],
  },
  {
    id: '本地修改',
    title: '本地修改',
    items: [
      {
        description: '显示工作路径下已修改的文件',
        command: 'git status',
      },
      {
        description: '显示与上次提交版本文件的不同',
        command: 'git diff',
      },
      {
        description: '把当前所有修改添加到下次提交中',
        command: 'git add .',
      },
      {
        description: '把对某个文件的修改添加到下次提交中',
        command: 'git add -p <file>',
      },
      {
        description: '提交本地的所有修改',
        command: 'git commit -a',
      },
      {
        description: '提交之前已标记的变化',
        command: 'git commit',
      },
      {
        description: '附加消息提交',
        command: "git commit -m 'message here'",
      },
      {
        description: '提交，并将提交时间设置为之前的某个日期',
        command: 'git commit --date="`date --date=\'n day ago\'`" -am "Commit Message"',
      },
      {
        description: '修改上次提交',
        command: 'git commit --amend',
      },
      {
        description: '把当前分支中未提交的修改移动到其他分支',
        command: `git stash
git checkout branch2
git stash pop`,
      },
    ],
  },
  {
    id: '搜索',
    title: '搜索',
    items: [
      {
        description: '从当前目录的所有文件中查找文本内容',
        command: 'git grep "Hello"',
      },
      {
        description: '在某一版本中搜索文本',
        command: 'git grep "Hello" v2.5',
      },
    ],
  },
  {
    id: '提交历史',
    title: '提交历史',
    items: [
      {
        description: '从最新提交开始，显示所有的提交记录',
        command: 'git log',
      },
      {
        description: '显示所有提交（仅显示提交的hash和message）',
        command: 'git log --oneline',
      },
      {
        description: '显示某个用户的所有提交',
        command: 'git log --author="username"',
      },
      {
        description: '显示某个文件的所有修改',
        command: 'git log -p <file>',
      },
      {
        description: '谁，在什么时间，修改了文件的什么内容',
        command: 'git blame <file>',
      },
    ],
  },
  {
    id: '分支与标签',
    title: '分支与标签',
    items: [
      {
        description: '列出所有的分支',
        command: 'git branch',
      },
      {
        description: '切换分支',
        command: 'git checkout <branch>',
      },
      {
        description: '创建并切换到新分支',
        command: 'git checkout -b <branch>',
      },
      {
        description: '基于当前分支创建新分支',
        command: 'git branch <new-branch>',
      },
      {
        description: '基于远程分支创建新的可追溯的分支',
        command: 'git branch --track <new-branch> <remote-branch>',
      },
      {
        description: '删除本地分支',
        command: 'git branch -d <branch>',
      },
      {
        description: '给当前版本打标签',
        command: 'git tag <tag-name>',
      },
    ],
  },
  {
    id: '更新与发布',
    title: '更新与发布',
    items: [
      {
        description: '列出当前配置的远程端',
        command: 'git remote -v',
      },
      {
        description: '显示远程端的信息',
        command: 'git remote show <remote>',
      },
      {
        description: '添加新的远程端',
        command: 'git remote add <remote> <url>',
      },
      {
        description: '下载远程端版本，但不合并到HEAD中',
        command: 'git fetch <remote>',
      },
      {
        description: '下载远程端版本，并自动与HEAD版本合并',
        command: 'git remote pull <remote> <url>',
      },
      {
        description: '将远程端版本合并到本地版本中',
        command: 'git pull origin master',
      },
      {
        description: '将本地版本发布到远程端',
        command: 'git push remote <remote> <branch>',
      },
      {
        description: '删除远程端分支',
        command: 'git push <remote> :<branch> (since Git v1.5.0)\ngit push <remote> --delete <branch> (since Git v1.7.0)',
      },
      {
        description: '发布标签',
        command: 'git push --tags',
      },
    ],
  },
  {
    id: '合并与重置',
    title: '合并与重置',
    items: [
      {
        description: '将分支合并到当前HEAD中',
        command: 'git merge <branch>',
      },
      {
        description: '将当前HEAD版本重置到分支中',
        command: 'git rebase <branch>',
      },
      {
        description: '退出重置',
        command: 'git rebase --abort',
      },
      {
        description: '解决冲突后继续重置',
        command: 'git rebase --continue',
      },
      {
        description: '使用配置好的merge tool解决冲突',
        command: 'git mergetool',
      },
      {
        description: '在编辑器中手动解决冲突后，标记文件为已解决冲突',
        command: 'git add <resolved-file>',
      },
    ],
  },
  {
    id: '撤销',
    title: '撤销',
    items: [
      {
        description: '放弃工作目录下的所有修改',
        command: 'git reset --hard HEAD',
      },
      {
        description: '移除缓存区的所有文件（撤销上次git add）',
        command: 'git reset HEAD',
      },
      {
        description: '放弃某个文件的所有本地修改',
        command: 'git checkout HEAD <file>',
      },
      {
        description: '重置一个提交（通过创建一个截然不同的新提交）',
        command: 'git revert <commit>',
      },
      {
        description: '将HEAD重置到指定的版本，并抛弃该版本之后的所有修改',
        command: 'git reset --hard <commit>',
      },
      {
        description: '将HEAD重置到上一次提交的版本，并将之后的修改标记为未添加到缓存区的修改',
        command: 'git reset <commit>',
      },
      {
        description: '将HEAD重置到上一次提交的版本，并保留未提交的本地修改',
        command: 'git reset --keep <commit>',
      },
    ],
  },
];

const gitFlowCommands: Category[] = [
  {
    id: '安装',
    title: '安装',
    items: [
      {
        description: 'OSX Homebrew',
        command: 'brew install git-flow',
      },
      {
        description: 'OSX Macports',
        command: 'port install git-flow',
      },
      {
        description: 'Linux',
        command: 'apt-get install git-flow',
      },
      {
        description: 'Windows (Cygwin)',
        command: "wget -q -O - --no-check-certificate https://github.com/nvie/gitflow/raw/develop/contrib/gitflow-installer.sh | bash",
      },
    ],
  },
  {
    id: '开始',
    title: '开始',
    items: [
      {
        description: '初始化Git Flow',
        command: 'git flow init',
      },
    ],
  },
  {
    id: '特性',
    title: '特性',
    items: [
      {
        description: '创建一个新特性分支',
        command: 'git flow feature start MYFEATURE',
      },
      {
        description: '完成新特性的开发',
        command: 'git flow feature finish MYFEATURE',
      },
      {
        description: '发布新特性到远程服务器',
        command: 'git flow feature publish MYFEATURE',
      },
      {
        description: '取得其他用户发布的新特性分支',
        command: 'git flow feature pull origin MYFEATURE',
      },
      {
        description: '追溯远端上的特性',
        command: 'git flow feature track MYFEATURE',
      },
    ],
  },
  {
    id: 'Release',
    title: 'Release',
    items: [
      {
        description: '开始创建release版本',
        command: 'git flow release start RELEASE [BASE]',
      },
      {
        description: '发布release版本',
        command: 'git flow release publish RELEASE',
      },
      {
        description: '完成release版本',
        command: 'git flow release finish RELEASE',
      },
    ],
  },
  {
    id: '紧急修复',
    title: '紧急修复',
    items: [
      {
        description: '开始紧急修复',
        command: 'git flow hotfix start VERSION [BASENAME]',
      },
      {
        description: '完成紧急修复',
        command: 'git flow hotfix finish VERSION',
      },
    ],
  },
];

export default function GitCheatSheet() {
  const [activeTab, setActiveTab] = useState<'git' | 'gitflow'>('git');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('创建');

  const currentCategories = activeTab === 'git' ? gitCommands : gitFlowCommands;

  const filteredCategories = currentCategories.map(category => ({
    ...category,
    items: category.items.filter(item =>
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.command.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter(category => category.items.length > 0);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  const handleCopy = async (command: string) => {
    await navigator.clipboard.writeText(command);
    setCopiedCommand(command);
    setTimeout(() => setCopiedCommand(null), 2000);
  };

  const allCategoryIds = currentCategories.map(c => c.id);

  const toggleAllCategories = (expand: boolean) => {
    const allExpanded: Record<string, boolean> = {};
    allCategoryIds.forEach(id => {
      allExpanded[id] = expand;
    });
    setExpandedCategories(allExpanded);
  };

  return (
    <>
      <header className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Git命令速查表</h2>
        <p className="text-muted-foreground text-lg">
          常用Git命令和Git Flow工作流速查
        </p>
      </header>

      <div className="glass-card rounded-[2rem] p-8 shadow-2xl border-white/40">
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setActiveTab('git');
                  setSearchQuery('');
                  setSelectedCategory('创建');
                }}
                className={cn(
                  "px-4 py-2 rounded-xl font-medium transition-all",
                  activeTab === 'git'
                    ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
                    : "text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5"
                )}
              >
                Git命令
              </button>
              <button
                onClick={() => {
                  setActiveTab('gitflow');
                  setSearchQuery('');
                  setSelectedCategory('安装');
                }}
                className={cn(
                  "px-4 py-2 rounded-xl font-medium transition-all",
                  activeTab === 'gitflow'
                    ? "bg-purple-500 text-white shadow-md shadow-purple-500/20"
                    : "text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5"
                )}
              >
                Git Flow
              </button>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="搜索命令..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-sm"
              />
            </div>
          </div>

          {searchQuery && (
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => toggleAllCategories(true)}
                className="text-sm text-blue-500 hover:text-blue-600 transition-colors"
              >
                展开全部
              </button>
              <span className="text-muted-foreground">|</span>
              <button
                onClick={() => toggleAllCategories(false)}
                className="text-sm text-blue-500 hover:text-blue-600 transition-colors"
              >
                折叠全部
              </button>
            </div>
          )}

          {!searchQuery && (
            <div className="flex flex-wrap gap-2 mb-4">
              {currentCategories.map(category => (
                <button
                  key={category.id}
                  onClick={() => {
                    setSelectedCategory(category.id);
                    toggleCategory(category.id);
                  }}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
                    selectedCategory === category.id
                      ? "bg-black/10 dark:bg-white/10 text-foreground"
                      : "text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5"
                  )}
                >
                  {category.title}
                </button>
              ))}
            </div>
          )}

          <div className="space-y-4">
            {filteredCategories.map(category => {
              const isExpanded = searchQuery || expandedCategories[category.id] || selectedCategory === category.id;

              return (
                <div key={category.id} className="border border-black/10 dark:border-white/10 rounded-xl overflow-hidden">
                  <button
                    onClick={() => {
                      if (!searchQuery) {
                        toggleCategory(category.id);
                        setSelectedCategory(category.id);
                      }
                    }}
                    className="w-full px-4 py-3 bg-black/5 dark:bg-white/5 flex items-center justify-between text-left hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                  >
                    <span className="font-medium">{category.title}</span>
                    {searchQuery ? (
                      <span className="text-xs text-muted-foreground bg-black/10 dark:bg-white/10 px-2 py-1 rounded-lg">
                        {category.items.length}条
                      </span>
                    ) : (
                      expandedCategories[category.id] || selectedCategory === category.id ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )
                    )}
                  </button>

                  {isExpanded && (
                    <div className="divide-y divide-black/10 dark:divide-white/10">
                      {category.items.map((item, index) => {
                        const commandKey = `${category.id}-${index}`;
                        const commands = item.command.split('\n');

                        return (
                          <div key={commandKey} className="p-4 hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                            <div className="flex items-start justify-between gap-4 mb-2">
                              <p className="text-sm text-muted-foreground flex-1">
                                {item.description}
                              </p>
                              <button
                                onClick={() => handleCopy(item.command)}
                                className={cn(
                                  "p-2 rounded-lg transition-all flex-shrink-0",
                                  copiedCommand === item.command
                                    ? "bg-green-500 text-white"
                                    : "bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10"
                                )}
                                title="复制命令"
                              >
                                {copiedCommand === item.command ? (
                                  <Check className="w-4 h-4" />
                                ) : (
                                  <Copy className="w-4 h-4" />
                                )}
                              </button>
                            </div>
                            <div className="space-y-1">
                              {commands.map((cmd, cmdIndex) => (
                                <pre key={cmdIndex} className="bg-black/10 dark:bg-white/10 rounded-lg p-3 overflow-x-auto">
                                  <code className="text-sm font-mono text-foreground">{cmd}</code>
                                </pre>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}

            {filteredCategories.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>未找到匹配的命令</p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-black/10 dark:border-white/10">
          <h3 className="font-medium mb-3">使用说明</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
            <div>
              <h4 className="text-sm font-medium mb-2 text-foreground">基本操作</h4>
              <ul className="space-y-1">
                <li>• 点击命令可复制到剪贴板</li>
                <li>• 使用搜索快速查找命令</li>
                <li>• 按分类快速导航</li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-2 text-foreground">推荐资源</h4>
              <ul className="space-y-1">
                <li>• 官方文档：https://git-scm.com/doc</li>
                <li>• Git Flow：https://nvie.com/posts/a-successful-git-branching-model/</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
