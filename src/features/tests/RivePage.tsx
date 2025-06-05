import { memo, useCallback, useEffect, useState } from 'react';
import { Container } from '../../components/Container/Container.tsx';
import { EventType, type Rive, useRive } from '@rive-app/react-canvas';
import sankeyUrl from '../../images/rive/bifi_sankey_.riv?url';
import { css } from '@repo/styles/css';
import { Button } from '../../components/Button/Button.tsx';

const RivePage = memo(() => {
  return (
    <Container maxWidth="lg">
      <Sankey />
    </Container>
  );
});

type State = 'loading' | 'loaded' | 'error' | 'playing' | 'paused' | 'stopped';

const Sankey = memo(() => {
  const [state, setState] = useState<State>('loading');

  const onLoad = useCallback(() => {
    setState('loaded');
  }, [setState]);
  const onLoadError = useCallback(() => {
    setState('error');
  }, [setState]);
  const onPlay = useCallback(() => {
    setState('playing');
  }, [setState]);
  const onPause = useCallback(() => {
    setState('paused');
  }, [setState]);
  const onStop = useCallback(() => {
    setState('stopped');
  }, [setState]);

  const { rive, RiveComponent, setContainerRef } = useRive(
    {
      src: sankeyUrl,
      autoplay: true,
      enableRiveAssetCDN: false,
      onLoad,
      onLoadError,
      onPlay,
      onPause,
      onStop,
    },
    {
      fitCanvasToArtboardHeight: true,
      shouldResizeCanvasToContainer: true,
    }
  );

  return (
    <div>
      <RiveDebug rive={rive} state={state} />
      <div ref={setContainerRef}>
        <RiveComponent />
      </div>
    </div>
  );
});

const RiveDebug = memo(({ rive, state }: { rive: Rive | null; state: State }) => {
  const [loops, setLoops] = useState(0);
  const [frames, setFrames] = useState(0);

  const handlePlay = useCallback(() => {
    rive?.play(rive?.animationNames, true);
  }, [rive]);
  const handleStop = useCallback(() => {
    rive?.stop();
  }, [rive]);
  const handlePause = useCallback(() => {
    rive?.pause();
  }, [rive]);

  useEffect(() => {
    if (rive) {
      const onLoop = () => {
        setLoops(prev => prev + 1);
        setFrames(0);
      };
      const onAdvance = () => {
        if (rive?.isPlaying) {
          setFrames(prev => prev + 1);
        }
      };
      const onStop = () => setFrames(0);

      rive.on(EventType.Loop, onLoop);
      rive.on(EventType.Stop, onStop);
      rive.on(EventType.Advance, onAdvance);

      return () => {
        rive.off(EventType.Loop, onLoop);
        rive.off(EventType.Advance, onAdvance);
        rive.off(EventType.Stop, onStop);
      };
    }
  }, [rive, setLoops, setFrames]);

  return (
    <div className={css({ display: 'flex', gap: '4px', alignItems: 'center' })}>
      <div className={css({ width: '140px' })}>State: {state}</div>
      <div className={css({ width: '100px' })}>Loops: {loops}</div>
      <div className={css({ width: '100px' })}> Frame: {frames} </div>
      <Button variant="filter" size="sm" onClick={handlePlay} disabled={state === 'playing'}>
        Play
      </Button>
      <Button variant="filter" size="sm" onClick={handlePause} disabled={state !== 'playing'}>
        Pause
      </Button>
      <Button variant="filter" size="sm" onClick={handleStop} disabled={state !== 'playing'}>
        Stop
      </Button>
    </div>
  );
});

// eslint-disable-next-line no-restricted-syntax -- default export required for React.lazy()
export default RivePage;
