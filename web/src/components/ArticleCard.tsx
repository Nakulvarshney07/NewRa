import type { RecItem } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { FiHeart, FiShare2, FiStar, FiExternalLink, FiCheck } from 'react-icons/fi';
import styled from 'styled-components';
import { useState } from 'react';

const StyledArticleCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  overflow: hidden;
  box-shadow:
    0 4px 20px rgba(0, 0, 0, 0.1),
    0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  border: 1px solid rgba(0, 0, 0, 0.05);
  position: relative;

  &:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow:
      0 20px 40px rgba(0, 0, 0, 0.15),
      0 4px 8px rgba(0, 0, 0, 0.1);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #667eea, #764ba2);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover::before {
    opacity: 1;
  }
`;

const ToastBadge = styled(motion.div)`
  position: absolute;
  top: 1rem;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(17, 24, 39, 0.9);
  color: white;
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  z-index: 10;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
`;

const CardHeader = styled.div`
  padding: 1.5rem 1.5rem 1rem;
`;

const CardMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const BadgesGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ItemBadge = styled.span`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const CategoryBadge = styled.span`
  background: rgba(102, 126, 234, 0.15);
  color: #5a67d8;
  padding: 0.25rem 0.65rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const ScoreContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background: rgba(255, 193, 7, 0.1);
  padding: 0.25rem 0.5rem;
  border-radius: 8px;
`;

const ScoreText = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  color: #f59e0b;
`;

const CardTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 0;
  line-height: 1.4;
  font-family: 'Poppins', sans-serif;

  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;

  transition: color 0.3s ease;
`;

const CardContent = styled.div`
  padding: 0 1.5rem 1.5rem;
`;

const AbstractText = styled.p`
  font-size: 0.875rem;
  color: #4b5563;
  line-height: 1.5;
  margin-top: 0.5rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ReasonContainer = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  margin-top: 1rem;
  padding: 0.75rem;
  background: linear-gradient(
    135deg,
    rgba(102, 126, 234, 0.1) 0%,
    rgba(118, 75, 162, 0.1) 100%
  );
  border-radius: 12px;
  border: 1px solid rgba(102, 126, 234, 0.2);
`;

const ReasonIcon = styled.span`
  color: #667eea;
  font-size: 0.875rem;
  margin-top: 0.125rem;
`;

const ReasonText = styled.p`
  font-size: 0.875rem;
  color: #667eea;
  font-weight: 500;
  margin: 0;
  line-height: 1.4;
`;

const CardActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #f0f0f0;
`;

const ReadMoreButton = styled(motion.button)`
  color: #667eea;
  font-weight: 600;
  font-size: 0.875rem;
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem 0;

  &:hover {
    color: #764ba2;
    text-decoration: underline;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled(motion.button)<{ $liked?: boolean }>`
  padding: 0.5rem;
  background: none;
  border: none;
  cursor: pointer;
  border-radius: 8px;
  color: ${props => (props.$liked ? '#ef4444' : '#6b7280')};
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: rgba(102, 126, 234, 0.1);
    color: ${props => (props.$liked ? '#dc2626' : '#667eea')};
  }
`;

export default function ArticleCard({ item }: { item: RecItem }) {
  const [isLiked, setIsLiked] = useState<boolean>(() => {
    try {
      return localStorage.getItem(`liked_${item.item_id}`) === 'true';
    } catch {
      return false;
    }
  });

  const [toastMsg, setToastMsg] = useState<string>('');

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 2200);
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextState = !isLiked;
    setIsLiked(nextState);
    try {
      localStorage.setItem(`liked_${item.item_id}`, String(nextState));
    } catch {
      // storage unavailable
    }
    triggerToast(nextState ? '❤️ Liked article!' : '🤍 Removed from liked');
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareUrl = item.url && item.url.startsWith('http') ? item.url : window.location.href;
    const shareText = `${item.title || 'Check out this news article'}\n\n${shareUrl}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: item.title,
          text: item.abstract || item.title,
          url: shareUrl,
        });
        return;
      } catch {
        // Fallback to clipboard if user dismissed or unsupported
      }
    }

    try {
      await navigator.clipboard.writeText(shareText);
      triggerToast('📋 Link copied to clipboard!');
    } catch {
      triggerToast('📋 Article info copied!');
    }
  };

  const handleReadMore = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (item.url && item.url.startsWith('http') && !item.url.includes('example.com')) {
      window.open(item.url, '_blank', 'noopener,noreferrer');
    } else {
      alert(
        `📰 ${item.title || 'Untitled'}\n\n` +
        `Category: ${item.category || 'General'}\n` +
        `Summary: ${item.abstract || 'No abstract available.'}\n\n` +
        `News ID: ${item.item_id}`
      );
    }
  };

  return (
    <StyledArticleCard
      whileHover={{
        y: -8,
        scale: 1.02,
        transition: { duration: 0.3, ease: 'easeOut' },
      }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <AnimatePresence>
        {toastMsg && (
          <ToastBadge
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <FiCheck style={{ color: '#10b981' }} />
            {toastMsg}
          </ToastBadge>
        )}
      </AnimatePresence>

      {/* Header with badges and score */}
      <CardHeader>
        <CardMeta>
          <BadgesGroup>
            <ItemBadge>{item.item_id}</ItemBadge>
            {item.category && <CategoryBadge>{item.category}</CategoryBadge>}
          </BadgesGroup>
          <ScoreContainer>
            <FiStar style={{ color: '#f59e0b', fontSize: '0.875rem' }} />
            <ScoreText>{item.score !== undefined ? item.score.toFixed(3) : '1.000'}</ScoreText>
          </ScoreContainer>
        </CardMeta>

        {/* Title */}
        <CardTitle>{item.title ?? 'Untitled Article'}</CardTitle>
      </CardHeader>

      {/* Content */}
      <CardContent>
        {item.abstract && <AbstractText>{item.abstract}</AbstractText>}

        {item.reason && (
          <ReasonContainer>
            <ReasonIcon>✨</ReasonIcon>
            <ReasonText>{item.reason}</ReasonText>
          </ReasonContainer>
        )}

        {/* Actions */}
        <CardActions>
          <ReadMoreButton
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleReadMore}
          >
            Read More
            <FiExternalLink style={{ fontSize: '0.875rem' }} />
          </ReadMoreButton>

          <ActionButtons>
            <ActionButton
              $liked={isLiked}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleLike}
              title={isLiked ? 'Unlike' : 'Like'}
            >
              <FiHeart
                style={{
                  fill: isLiked ? '#ef4444' : 'none',
                  fontSize: '1.1rem',
                }}
              />
            </ActionButton>
            <ActionButton
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleShare}
              title="Share or Copy Link"
            >
              <FiShare2 style={{ fontSize: '1.1rem' }} />
            </ActionButton>
          </ActionButtons>
        </CardActions>
      </CardContent>
    </StyledArticleCard>
  );
}
